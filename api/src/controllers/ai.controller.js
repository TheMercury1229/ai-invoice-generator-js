import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Invoice from "../models/invoice.model.js";
dotenv.config();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
export const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const PROMPT = `You are an expert invoice data extraction AI. Analyze the following text and extract relevant information to create an invoice .
    The output MUST be a valid JSON object
    The JSON object should contain the following structure:
    {
        "clientName": "string",
        "email": "string" (if available),
        "address": "string (if available)",
        "items":[
            {
            "name": "string",
            "quantity": number,
            "unitPrice": number,
            }
        ]
    }
        Here is the text to parse:
        --- TEXT START ---
        ${text}
        --- TEXT END ---

        Extract the data and provide only the JSON object as output.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });
    const responseText = response.text;
    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Could not extract text from AI response.");
      }
    }

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice:", error);
    res.status(500).json({
      message: "Failed to parse invoice data from text",
      details: error.message,
    });
  }
};

export const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }
  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        message: "Failed to parse invoice data from text.",
        details: error.message,
      });
    }

    const PROMPT = `You are an expert and polite accounting assistant.Write a friendly reminder email to a client about an overdue
    or upcoming invoice payment. 
    Use the following invoice details to craft the email:
      - Client Name: ${invoice.clientName}
      - Invoice Number: ${invoice.invoiceNumber}
      - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      - Total Amount: $${invoice.total.toFixed(2)}
      
     The tone should be friendly but clear.Keep it concise. Start the email with "Subject:" 
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });
    return res.status(200).json({ reminderText: response.text });
  } catch (error) {
    console.error("Error generating remainder email:", error);
    res.status(500).json({
      message: "Failed to generate reminder email",
      details: error.message,
    });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    if (invoices.length === 0) {
      return res.status(200).json({
        insights: ["No invoice data available to generate insights."],
      });
    }

    // Process and summarize invoice data
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const outstandingAmount = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.total,
      0
    );

    const dataSummary = `
    - Total Invoices: ${totalInvoices}
    - Total Paid Invoices: ${paidInvoices.length}
    - Total Unpaid/Pending Invoices: ${unpaidInvoices.length}
    - Total Revenue Collected from Paid Invoices: $${totalRevenue.toFixed(2)}
    - Total Outstanding Amount from Unpaid/Pending Invoices: $${outstandingAmount.toFixed(
      2
    )}
    - Recent Invoices(Last 5):${invoices
      .slice(0, 5)
      .map(
        (inv) =>
          `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(
            2
          )} with status ${inv.status} `
      )
      .join(", ")}
    `;
    const PROMPT = `
    You are a friendly and insightful financial analyst for a small business owner.
    Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
    Each insight should be a short string in a JSON array.
    The insight should be encouraging and helpful.Do not just repeat the data.
    For example, if there is a high outstanding amount ,suggest sending reminders.If revenue is higher be encouraging.
    
    Data Summary:
    ${dataSummary}
    
    Return your response as a valid JSON object with a single key "insights" which is an array of strings.
    Example format:{"insights":["Your revenue is high this month!","Your outstanding amount is low!","Consider sending reminders for unpaid invoices."]}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });
    const responseText = response.text;
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(cleanedJson);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      message: "Failed to generate dashboard summary",
      details: error.message,
    });
  }
};

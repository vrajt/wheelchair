'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting anomalous transactions.
 *
 * - detectTransactionAnomaly -  A function that analyzes transaction data for suspicious patterns.
 * - TransactionAnomalyInput - The input type for the detectTransactionAnomaly function.
 * - TransactionAnomalyOutput - The return type for the detectTransactionAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionAnomalyInputSchema = z.object({
  transactionData: z.string().describe('A string containing transaction details.'),
  transactionVolume: z.number().describe('The total transaction volume.'),
  userLocation: z.string().describe('The user location.'),
  historicalTransactionData: z.string().describe('Historical transaction data for the user.'),
});
export type TransactionAnomalyInput = z.infer<typeof TransactionAnomalyInputSchema>;

const TransactionAnomalyOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the transaction is flagged as anomalous.'),
  explanation: z.string().describe('Explanation of why the transaction is flagged as anomalous.'),
  riskScore: z.number().describe('A risk score indicating the likelihood of fraud.'),
});
export type TransactionAnomalyOutput = z.infer<typeof TransactionAnomalyOutputSchema>;

export async function detectTransactionAnomaly(input: TransactionAnomalyInput): Promise<TransactionAnomalyOutput> {
  return detectTransactionAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transactionAnomalyPrompt',
  input: {schema: TransactionAnomalyInputSchema},
  output: {schema: TransactionAnomalyOutputSchema},
  prompt: `You are an expert in fraud detection. Analyze the following transaction data and determine if it is anomalous.

Transaction Data: {{{transactionData}}}
Transaction Volume: {{{transactionVolume}}}
User Location: {{{userLocation}}}
Historical Transaction Data: {{{historicalTransactionData}}}

Based on this information, determine if the transaction is anomalous, provide an explanation, and assign a risk score (0-100). You must set the isAnomalous output field appropriately.`,
});

const detectTransactionAnomalyFlow = ai.defineFlow(
  {
    name: 'detectTransactionAnomalyFlow',
    inputSchema: TransactionAnomalyInputSchema,
    outputSchema: TransactionAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

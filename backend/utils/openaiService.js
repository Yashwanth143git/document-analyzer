// const { OpenAI } = require('openai');
// const pdf = require('pdf-parse');

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// class OpenAIService {
//   // Extract text from PDF
//   static async extractTextFromPDF(fileBuffer) {
//     try {
//       console.log(' Extracting text from PDF...');
//       const data = await pdf(fileBuffer);
//       return data.text;
//     } catch (error) {
//       console.error('PDF extraction error:', error);
//       throw new Error('Failed to extract text from PDF');
//     }
//   }

//   // Generate document summary using OpenAI
//   static async generateSummary(documentText) {
//     try {
//       console.log(' Generating AI summary...');
      
//       const completion = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are a helpful assistant that provides concise, well-structured summaries of documents. Focus on key points, main arguments, and important findings. Format the response with clear sections using markdown."
//           },
//           {
//             role: "user",
//             content: `Please provide a comprehensive summary of this document. Structure it with clear sections and highlight the most important information:\n\n${documentText.substring(0, 12000)}` // Limit text length
//           }
//         ],
//         max_tokens: 1000,
//         temperature: 0.3
//       });

//       return completion.choices[0].message.content;
//     } catch (error) {
//       console.error('OpenAI summary error:', error);
//       throw new Error('Failed to generate document summary');
//     }
//   }

//   // Answer questions about the document
//   static async answerQuestion(documentText, question) {
//     try {
//       console.log(' Answering question about document...');
      
//       const completion = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: `You are a helpful assistant that answers questions based strictly on the provided document. If the information is not in the document, say so. Base your answers only on the document content provided. Here is the document:\n\n${documentText.substring(0, 8000)}`
//           },
//           {
//             role: "user",
//             content: question
//           }
//         ],
//         max_tokens: 500,
//         temperature: 0.2
//       });

//       return completion.choices[0].message.content;
//     } catch (error) {
//       console.error('OpenAI Q&A error:', error);
//       throw new Error('Failed to answer question');
//     }
//   }

//   // Validate OpenAI API key
//   static async validateAPIKey() {
//     try {
//       await openai.models.list();
//       return true;
//     } catch (error) {
//       console.error('OpenAI API key validation failed:', error.message);
//       return false;
//     }
//   }
// }

// module.exports = OpenAIService;



const { OpenAI } = require('openai');
const pdf = require('pdf-parse');

class OpenAIService {
  static getClient() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  static async extractTextFromPDF(fileBuffer) {
    const data = await pdf(fileBuffer);
    return data.text;
  }

  static async generateSummary(documentText) {
    const openai = this.getClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant...' },
        { role: 'user', content: documentText.substring(0, 12000) }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });
    return completion.choices[0].message.content;
  }

  static async answerQuestion(documentText, question) {
    const openai = this.getClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: documentText.substring(0, 8000) },
        { role: 'user', content: question }
      ],
      max_tokens: 500,
      temperature: 0.2,
    });
    return completion.choices[0].message.content;
  }

  static async validateAPIKey() {
    try {
      const openai = this.getClient();
      await openai.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI API key validation failed:', error.message);
      return false;
    }
  }
}

module.exports = OpenAIService;

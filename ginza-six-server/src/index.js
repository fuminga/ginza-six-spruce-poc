//ginza-six-server/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // For development only, restrict in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock data for VC issuance
const sessions = {};
const JWT_SECRET = process.env.JWT_SECRET || 'ginza-six-secret-key';

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'GINZA SIX VC Issuance Server is running' });
});

// Create issuance session
app.post('/api/issuance/session', (req, res) => {
  try {
    const { customerEmail, category, experience } = req.body;
    
    if (!customerEmail || !category || !experience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate a session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Store session data
    sessions[sessionId] = {
      customerEmail,
      category,
      experience,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Issue credential
app.post('/api/issuance/credential', (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId || !sessions[sessionId]) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    const session = sessions[sessionId];
    
    // Create a mock VC
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'SenseVC'],
      issuer: 'did:web:ginza6.tokyo',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:key:z6Mk${Math.random().toString(36).substring(2, 10)}`,
        category: session.category,
        experience: session.experience,
        issuedOn: new Date().toISOString().split('T')[0]
      },
      proof: {
        type: 'Ed25519Signature2018',
        created: new Date().toISOString(),
        verificationMethod: 'did:web:ginza6.tokyo#key1',
        proofPurpose: 'assertionMethod',
        jws: 'mock_signature_for_poc_testing'
      }
    };
    
    // Update session status
    sessions[sessionId].status = 'issued';
    
    res.json({ credential });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify credential
app.post('/api/verification/verify', (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }
    
    // For PoC, we'll just check if the credential has the expected structure
    if (credential.type && 
        credential.type.includes('VerifiableCredential') && 
        credential.issuer === 'did:web:ginza6.tokyo' && 
        credential.credentialSubject) {
      
      res.json({ 
        isValid: true, 
        subject: credential.credentialSubject 
      });
    } else {
      res.json({ 
        isValid: false, 
        error: 'Invalid credential format or issuer' 
      });
    }
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

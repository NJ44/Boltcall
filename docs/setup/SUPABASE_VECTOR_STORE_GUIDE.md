# Supabase Vector Store Integration Guide

## Option 1: Direct Implementation (Recommended)

### Step 1: Enable Vector Extension in Supabase

Run this in your Supabase SQL Editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Uncomment the embedding_vector column in knowledge_base table
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS embedding_vector VECTOR(1536);

-- Create vector index for efficient similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding 
ON knowledge_base 
USING ivfflat (embedding_vector vector_cosine_ops) 
WITH (lists = 100);
```

### Step 2: Install Required Packages

```bash
npm install openai @supabase/supabase-js
```

### Step 3: Create Vector Embedding Service

Create `src/lib/embeddings.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // or 'text-embedding-ada-002'
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Generate embeddings for multiple texts (batch)
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}
```

### Step 4: Create Document Upload Service

Create `src/lib/knowledgeBase.ts`:

```typescript
import { supabase } from './supabase';
import { generateEmbedding } from './embeddings';

interface DocumentUpload {
  title: string;
  content: string;
  contentType?: string;
  category?: string;
  tags?: string[];
  userId: string;
  businessProfileId: string;
}

export async function uploadDocumentToVectorStore(document: DocumentUpload) {
  try {
    // Generate embedding for the document content
    const embedding = await generateEmbedding(document.content);
    
    // Insert into Supabase with embedding
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        title: document.title,
        content: document.content,
        content_type: document.contentType || 'text',
        category: document.category,
        tags: document.tags || [],
        user_id: document.userId,
        business_profile_id: document.businessProfileId,
        embedding_vector: embedding, // This is the vector!
        status: 'active',
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// Search similar documents using vector similarity
export async function searchSimilarDocuments(
  query: string,
  userId: string,
  limit: number = 5
) {
  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Search using vector similarity
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
      user_id: userId,
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
}
```

### Step 5: Create Vector Search Function in Supabase

Run this SQL in Supabase SQL Editor:

```sql
-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  user_id UUID
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding_vector <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 
    knowledge_base.user_id = match_documents.user_id
    AND knowledge_base.status = 'active'
    AND 1 - (knowledge_base.embedding_vector <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding_vector <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Step 6: Update KnowledgeBasePage to Use Supabase

Update `src/pages/dashboard/KnowledgeBasePage.tsx` to:
- Load documents from Supabase instead of localStorage
- Upload documents with embeddings
- Support file upload (PDF, DOCX, TXT) and parse content

## Option 2: Using n8n (Workflow Automation)

### Pros:
- ✅ Visual workflow builder
- ✅ Built-in integrations (Supabase, OpenAI, file processing)
- ✅ Can schedule automatic updates
- ✅ Easy to modify without code changes

### Cons:
- ❌ External dependency
- ❌ Additional cost (if using hosted n8n)
- ❌ Less integrated with your app UI
- ❌ Requires webhook setup

### n8n Workflow Steps:

1. **Trigger**: Webhook from your app or scheduled
2. **File Processing**: Parse PDF/DOCX/TXT files
3. **Text Chunking**: Split large documents into smaller chunks
4. **Generate Embeddings**: Call OpenAI API
5. **Store in Supabase**: Insert with embeddings

### Example n8n Webhook Call:

```typescript
// In your app
const uploadViaN8n = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('businessProfileId', businessProfileId);
  
  await fetch('https://your-n8n-instance.com/webhook/upload-document', {
    method: 'POST',
    body: formData,
  });
};
```

## Recommendation

**Use Direct Implementation** because:
1. You already have Supabase set up
2. Better user experience (real-time feedback)
3. More control over the process
4. No external dependencies
5. Your schema already supports it

Would you like me to implement the direct Supabase vector store integration in your codebase?


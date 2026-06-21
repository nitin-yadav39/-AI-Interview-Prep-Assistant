const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL or SUPABASE_KEY is missing in the environment variables.');
  console.error('   Please add them to backend/.env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // suitable for backend environment
  }
});

/**
 * Format PostgreSQL/Supabase user record to match the shape expected by frontend.
 */
function formatUser(user) {
  if (!user) return null;
  return {
    _id: user.id,
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

/**
 * Format PostgreSQL/Supabase interview record to match the shape expected by frontend.
 */
function formatInterview(interview) {
  if (!interview) return null;
  
  // Ensure chatTranscript elements are correctly mapped
  const chatTranscript = (interview.chat_transcript || []).map(chat => ({
    role: chat.role,
    message: chat.message,
    timestamp: chat.timestamp
  }));

  return {
    _id: interview.id,
    id: interview.id,
    userId: interview.user_id,
    position: interview.position,
    experience: interview.experience,
    difficulty: interview.difficulty,
    isStart: interview.is_start,
    chatTranscript: chatTranscript,
    createdAt: interview.created_at,
    updatedAt: interview.updated_at
  };
}

module.exports = {
  supabase,
  formatUser,
  formatInterview
};

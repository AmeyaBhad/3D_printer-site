package com.forge3d.backend.service;

import com.forge3d.backend.dto.ChatResponse;

/**
 * Single entry-point for the chatbot. The rule-based implementation is the default;
 * later you can swap in an LLM-backed service (Claude/OpenAI) by providing a different bean.
 */
public interface ChatService {
    ChatResponse reply(String userMessage);
}

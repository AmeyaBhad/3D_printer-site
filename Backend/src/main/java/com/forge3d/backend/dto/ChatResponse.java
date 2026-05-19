package com.forge3d.backend.dto;

import java.util.List;

public class ChatResponse {
    private String reply;
    private List<String> suggestions; // quick-reply chip strings for the UI

    public ChatResponse() {}

    public ChatResponse(String reply, List<String> suggestions) {
        this.reply = reply;
        this.suggestions = suggestions;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}

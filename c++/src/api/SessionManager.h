#pragma once
#include <string>

class SessionManager {
public:
    static SessionManager& Instance() {
        static SessionManager instance;
        return instance;
    }

    void SetToken(const std::string& t) { token = t; }
    const std::string& GetToken() const { return token; };
    bool HasToken() const { return !token.empty(); }

private:
    SessionManager() = default;
    std::string token;
};
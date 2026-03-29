#pragma once
#include <string>
#include "HttpClient.h"

class AuthService {
    public:
    explicit AuthService(HttpClient& client);
    bool Login(const std::string& username, const std::string& password) const;

private:
    HttpClient& http;
};
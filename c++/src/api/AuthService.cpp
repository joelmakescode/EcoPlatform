#include "AuthService.h"
#include "SessionManager.h"
#include "../../external/json.hpp"

AuthService::AuthService(HttpClient &client) : http(http) {
}

bool AuthService::Login(const std::string& username, const std::string& password) const {

    nlohmann::json j;
    j["username"] = username;
    j["password"] = password;

    std::string response = http.Post("", j.dump());

    auto json = nlohmann::json::parse(response);

    if (!json.contains("token")) return false;

    SessionManager::Instance().SetToken(json["token"]);
    return true;
}

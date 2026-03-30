#include "AuthService.h"
#include "SessionManager.h"
#include "../../external/json.hpp"

AuthService::AuthService(HttpClient &client) : http(client) {}

bool AuthService::Login(const std::string& username, const std::string& password, std::string& error) const {

    nlohmann::json j;
    j["username"] = username;
    j["password"] = password;

    long status = 0;
    std::string response = http.Post("http://api.eco-platform.app/api/ecoplatform-user/login", j.dump(), &status);

    if (status == 404) {
        error = "Benutzer existiert nicht!";
        return false;
    }

    if (status == 401) {
        error = "Falsches Passwort!";
        return false;
    }

    if (status != 200) {
        error = "Unbekannter Serverfehler (" + std::to_string(status) + ")";
        return false;
    }

    auto json = nlohmann::json::parse(response, nullptr, false);
    if (json.is_discarded()) {
        error = "Ungültige Antwort vom Server!";
        return false;
    }

    if (!json.contains("token")) {
        error = "Server hat keinen Token zurückgegeben!";
        return false;
    }

    SessionManager::Instance().SetToken(json["token"]);
    return true;
}

bool AuthService::Register(const std::string &username, const std::string &password, std::string &error) const {
    nlohmann::json j;
    j["username"] = username;
    j["password"] = password;

    long status = 0;
    std::string response = http.Post("http://api.eco-platform.app/api/ecoplatform-user/register", j.dump(), &status);

    if (status == 409) {
        error = "Nutzername existiert bereits.";
        return false;
    }

    if (status != 200 && status != 201) {
        error = "Registrierung fehlgeschlagen";
        return false;
    }

    return true;
}

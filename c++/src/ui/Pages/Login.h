#pragma once
#include <string>
#include <GLFW/glfw3.h>
#include "../../api/AuthService.h"

enum class LoginScreenState {
    Login,
    Register
};

class LoginPage {
public:
    void render(bool& loggedIn, GLFWwindow* window);

private:
    LoginScreenState state = LoginScreenState::Login;

    HttpClient httpClient;
    AuthService authService{ httpClient };

    void renderLogin(bool& loggedIn, GLFWwindow* window);
    void renderRegister();

    bool tryLogin(const std::string& username, const std::string& password, std::string& error) const;
    bool tryRegister(const std::string& username, const std::string& password, std::string& error) const;
};

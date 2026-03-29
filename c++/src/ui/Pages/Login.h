#pragma once
#include <string>
#include <GLFW/glfw3.h>

class LoginPage {
    public:
    static bool tryLogin(const std::string& username, const std::string& password);
    static void render(bool& loggedIn, GLFWwindow* window);
};

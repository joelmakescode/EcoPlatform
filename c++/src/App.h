#include <GLFW/glfw3.h>
#include "ui/Pages/Login.h"

class App {
    public:
    void renderUI();
    GLFWwindow* window;

    private:
    bool loggedIn = false;
    LoginPage loginPage;
};

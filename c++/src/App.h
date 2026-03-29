#include <GLFW/glfw3.h>

class App {
    public:
    bool loggedIn = false;
    GLFWwindow* window = nullptr;

    void renderUI();
};

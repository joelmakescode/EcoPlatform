#include "Login.h"

#include <GLFW/glfw3.h>

#include "imgui.h"
#include "../../api/AuthService.h"
#include "../Languages/Translation.h"

void LoginPage::render(bool& loggedIn, GLFWwindow* window)
{
    if (state == LoginScreenState::Login)
        renderLogin(loggedIn, window);
    else
        renderRegister();
}

bool LoginPage::tryLogin(const std::string& username, const std::string& password, std::string& error) const {
    return authService.Login(username, password, error);
}

bool LoginPage::tryRegister(const std::string& username, const std::string& password, std::string& error) const {
    return authService.Register(username, password, error);
}

void LoginPage::renderLogin(bool& loggedIn, GLFWwindow* window)
{
    ImVec2 display = ImGui::GetIO().DisplaySize;
    ImGui::SetNextWindowPos({0, 0});
    ImGui::SetNextWindowSize(display);

    ImGui::Begin("Login", nullptr,
        ImGuiWindowFlags_NoTitleBar |
        ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoCollapse
    );

    float boxWidth = 360.0f;
    float boxHeight = 240.0f;

    ImVec2 boxPos((display.x - boxWidth) * 0.5f,
                  (display.y - boxHeight) * 0.5f);

    ImGui::SetCursorPos(boxPos);

    ImGui::BeginChild("LoginBox", {boxWidth, boxHeight}, true);

    static char username[128] = "";
    static char password[128] = "";
    static std::string errorMessage = "";

    ImGui::PushFont(ImGui::GetFont());

    ImGui::Text("Willkommen!");
    ImGui::Separator();
    ImGui::Spacing();

    ImGui::Text("Username");
    ImGui::SameLine(110);
    ImGui::InputText("##login_username", username, 128);

    ImGui::Text("Passwort");
    ImGui::SameLine(110);
    ImGui::InputText("##login_password", password, 128, ImGuiInputTextFlags_Password);

    if (ImGui::Button("Login"))
    {
        std::string error;
        if (tryLogin(username, password, error))
        {
            loggedIn = true;

            GLFWmonitor* monitor = glfwGetPrimaryMonitor();
            const GLFWvidmode* mode = glfwGetVideoMode(monitor);

            int newW = 1280;
            int newH = 720;
            int posX = (mode->width - newW) / 2;
            int posY = (mode->height - newH) / 2;

            glfwSetWindowSize(window, newW, newH);
            glfwSetWindowPos(window, posX, posY);
        }
        else
        {
            errorMessage = error;
        }
    }

    if (!errorMessage.empty()) {
        ImGui::Spacing();
        ImGui::TextColored({1, 0, 0, 1}, "%s", errorMessage.c_str());
    }

    ImGui::Spacing();
    ImGui::Separator();
    ImGui::Spacing();

    if (ImGui::Button("Noch keinen Account? Jetzt registrieren!", ImVec2(-1, 30))) {
        state = LoginScreenState::Register;
    }

    ImGui::PopFont();
    ImGui::EndChild();
    ImGui::End();
}

void LoginPage::renderRegister()
{
    ImVec2 display = ImGui::GetIO().DisplaySize;
    ImGui::SetNextWindowPos({0, 0});
    ImGui::SetNextWindowSize(display);

    ImGui::Begin("Register", nullptr,
        ImGuiWindowFlags_NoTitleBar |
        ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoCollapse
    );

    float boxWidth = 360.0f;
    float boxHeight = 260.0f;

    ImVec2 boxPos((display.x - boxWidth) * 0.5f,
                  (display.y - boxHeight) * 0.5f);

    ImGui::SetCursorPos(boxPos);

    ImGui::BeginChild("RegisterBox", {boxWidth, boxHeight}, true);

    static char username[128] = "";
    static char password[128] = "";
    static std::string msg = "";

    ImGui::PushFont(ImGui::GetFont());

    ImGui::Text("Registrieren");
    ImGui::Separator();
    ImGui::Spacing();

    ImGui::Text("Username");
    ImGui::SameLine(110);
    ImGui::InputText("##reg_username", username, 128);

    ImGui::Text("Passwort");
    ImGui::SameLine(110);
    ImGui::InputText("##reg_password", password, 128, ImGuiInputTextFlags_Password);

    if (ImGui::Button("Registrieren"))
    {
        std::string error;

        if (tryRegister(username, password, error))
        {
            msg = "✅ Erfolgreich registriert!";
        }
        else
        {
            msg = error;
        }
    }

    if (!msg.empty())
    {
        ImGui::Spacing();

        bool success = msg.rfind("✅", 0) == 0;
        ImVec4 color = success ? ImVec4(0, 1, 0, 1) : ImVec4(1, 0, 0, 1);

        ImGui::TextColored(color, "%s", msg.c_str());
    }

    ImGui::Spacing();
    ImGui::Separator();
    ImGui::Spacing();

    if (ImGui::Button("Zurück zum Login", ImVec2(-1, 30)))
    {
        state = LoginScreenState::Login;
    }

    ImGui::PopFont();
    ImGui::EndChild();
    ImGui::End();
}
#include "Login.h"

#include <GLFW/glfw3.h>

#include "imgui.h"

bool LoginPage::tryLogin(const std::string& username, const std::string& password) {
    if (password == "1234") {
        return true;
    }

    return false;
}

void LoginPage::render(bool& loggedIn, GLFWwindow* window) {
    ImVec2 display = ImGui::GetIO().DisplaySize;

    ImGui::SetNextWindowPos(ImVec2(0, 0));
    ImGui::SetNextWindowSize(ImGui::GetIO().DisplaySize);

    ImGui::Begin(
        "Login",
        nullptr,
        ImGuiWindowFlags_NoTitleBar  |
        ImGuiWindowFlags_NoResize    |
        ImGuiWindowFlags_NoMove      |
        ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoCollapse
    );

    float boxWidth = 360.0f;
    float boxHeight = 200.0f;

    ImVec2 boxPos = ImVec2(
        (display.x - boxWidth) * 0.5f,
        (display.y - boxHeight) * 0.5f
    );

    ImGui::SetCursorPos(boxPos);

    ImGui::BeginChild(
        "LoginBox",
        ImVec2(boxWidth, boxHeight),
        true
    );

    ImGui::PushFont(ImGui::GetFont());

    ImGui::Text("Willkommen!");
    ImGui::Separator();
    ImGui::Spacing();

    static char username[128] = "";
    static char password[128] = "";

    ImGui::Text("Username");
    ImGui::SameLine(70);
    ImGui::InputText("##username", username, 128);

    ImGui::Text("Password");
    ImGui::SameLine(70);
    ImGui::InputText("##password", password, 128, ImGuiInputTextFlags_Password);

    if (ImGui::Button("Login")) {
        if (tryLogin(username, password)) {
            loggedIn = true;

            GLFWmonitor* monitor = glfwGetPrimaryMonitor();
            const GLFWvidmode* mode = glfwGetVideoMode(monitor);

            int newW = 1280;
            int newH = 720;

            int posX = (mode->width - newW) / 2;
            int posY = (mode->height - newH) / 2;

            glfwSetWindowSize(window, 1280, 720);
            glfwSetWindowPos(window, posX, posY);
        } else {
            ImGui::TextColored(ImVec4(1, 0, 0, 1), "Falsches Passwort!");
        }
    }

    ImGui::Spacing();
    ImGui::Separator();
    ImGui::Spacing();

    ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0,0,0,0));
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ImVec4(0.3,0.3,0.3,0.3));
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ImVec4(0.4,0.4,0.4,0.4));
    if (ImGui::Button("Noch keinen Account? Jetzt registrieren!", ImVec2(-1, 30))) {
        // später: Registrierungs-Screen öffnen
    }

    ImGui::PopStyleColor(3);
    ImGui::PopFont();
    ImGui::EndChild();
    ImGui::End();
}
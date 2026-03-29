#include "App.h"
#include "imgui.h"
#include "ui/Pages/Login.h"
#include "ui/Sidebar/Sidebar.h"

Sidebar sidebar;

void App::renderUI() {
    if (!loggedIn) {
        LoginPage::render(loggedIn, window);
    } else {
        sidebar.render();
    }
}

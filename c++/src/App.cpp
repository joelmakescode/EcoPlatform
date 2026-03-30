#include "App.h"
#include "imgui.h"
#include "ui/Pages/Login.h"
#include "ui/Sidebar/Sidebar.h"

Sidebar sidebar;

void App::renderUI() {
    if (!loggedIn) {
        loginPage.render(loggedIn, window);
    } else {
        sidebar.render();
    }
}

cmake_minimum_required(VERSION 3.10)
project(EcoPlatform)

set(CMAKE_CXX_STANDARD 17)

# GLFW
find_package(PkgConfig REQUIRED)
find_package(CURL REQUIRED)
pkg_search_module(GLFW REQUIRED glfw3)

find_path(GLFW_INCLUDE_DIR GLFW/glfw3.h
        PATHS /opt/homebrew/include /usr/local/include /usr/include
)

find_library(GLFW_LIBRARY glfw
        PATHS /opt/homebrew/lib /usr/local/lib /usr/lib
)

include_directories(${GLFW_INCLUDE_DIR})

include_directories(
        external/imgui
        external/imgui/backends
        ${GLFW_INCLUDE_DIRS}
)

file(GLOB IMGUI_SRC
        external/imgui/*.cpp
        external/imgui/backends/imgui_impl_glfw.cpp
        external/imgui/backends/imgui_impl_opengl3.cpp
)

file(GLOB SRC
        src/*.cpp
)

add_executable(EcoPlatform
        ${SRC}
        ${IMGUI_SRC}
        src/ui/Sidebar/Sidebar.h
        src/ui/Sidebar/Sidebar.cpp
        src/ui/Pages/Portfolio.cpp
        src/ui/Pages/Portfolio.h
        src/ui/Pages/Aktien.h
        src/ui/Pages/Aktien.cpp
        src/ui/Pages/Login.cpp
        src/ui/Pages/Login.h
        src/api/HttpClient.h
        src/api/HttpClient.h
        src/api/HttpClient.cpp
        src/api/SessionManager.h
        src/api/AuthService.cpp
        src/api/AuthService.h
        external/json.hpp
        src/ui/Languages/Translation.h
        src/ui/Languages/Translation.cpp
)

# macOS
if(APPLE)
    target_link_libraries(EcoPlatform
            ${GLFW_LIBRARY}
            "-framework Cocoa"
            "-framework IOKit"
            "-framework CoreVideo"
            "-framework OpenGL"
            CURL::libcurl
    )
else()
    target_link_libraries(EcoPlatform
            ${GLFW_LIBRARIES}
            opengl32
    )
endif()
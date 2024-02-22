cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

add_compile_options(
        -fexceptions
        -frtti
        -std=c++17)

file(GLOB tm_SRC CONFIGURE_DEPENDS facebook/react/*.cpp)
file(GLOB utopia_SRC CONFIGURE_DEPENDS utopia/react/*.cpp)
add_library(tm STATIC ${tm_SRC} ${utopia_SRC})

target_include_directories(tm PUBLIC .)
target_include_directories(react_codegen_AppSpecs PUBLIC .)

message(WARNING "!!!!!!!!!!! ${CMAKE_LIBRARY_ARCHITECTURE}")

set(tm_lib_dir utopia/lib/${CMAKE_LIBRARY_ARCHITECTURE})
if(EXISTS ${tm_lib_dir}-debug AND CMAKE_TARGET_TYPE EQUAL Debug)
  set(tm_lib_dir ${tm_lib_dir}-debug)
endif()
target_link_directories(tm PUBLIC ${tm_lib_dir})

target_link_libraries(tm
        jsi
        react_nativemodule_core
        react_codegen_AppSpecs
        ucore
        uprofile
        md5
        sodium
        spdlog
        sqlite3
        z)

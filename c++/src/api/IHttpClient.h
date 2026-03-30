#pragma once
#include <string>

class IHttpClient {
public:
    virtual ~IHttpClient() = default;

    virtual std::string Get(const std::string& url) = 0;
    virtual std::string Post(const std::string& url, const std::string& body, long* httpStatus) = 0;
};

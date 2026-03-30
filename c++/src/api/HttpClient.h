#include "IHttpClient.h"

class HttpClient : public IHttpClient {
    public:
        std::string Get(const std::string& url) override;
        std::string Post(const std::string& url, const std::string& body, long* httpStatus) override;

        HttpClient();
        ~HttpClient() override;
};
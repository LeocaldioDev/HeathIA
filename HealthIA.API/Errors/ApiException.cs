namespace HealthIA.API.Errors
{
    public class ApiException
    {
        public string StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }

        public ApiException(string statusCode, string message = null, string details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }
    }
}

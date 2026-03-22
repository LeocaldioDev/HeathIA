using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace HealthIA.API.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
                "wwwroot","index.html"),"text/HTML");
        }
    }
}

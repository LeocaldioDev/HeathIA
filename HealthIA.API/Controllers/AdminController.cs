using Microsoft.AspNetCore.Mvc;

namespace HealthIA.API.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

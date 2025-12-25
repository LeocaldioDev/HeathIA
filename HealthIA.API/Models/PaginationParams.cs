using System.ComponentModel.DataAnnotations;

namespace HealthIA.API.Models
{
    public class PaginationParams
    {
        [Range(1, int.MaxValue, ErrorMessage = "O numero da pagina deve ser maior que 0")]
        public int PageNumber { get; set; }
        [Range(1, 50, ErrorMessage = "O maximo de itens por pagina é 50")]
        public int PageSize { get; set; }
    }
}

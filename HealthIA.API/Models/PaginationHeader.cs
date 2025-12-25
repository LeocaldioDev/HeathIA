namespace HealthIA.API.Models
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPage { get; set; }

        public PaginationHeader(int currentPage, int itemsPerPage, int totalItems,int totalPage) 
        {
            this.CurrentPage = currentPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalItems = totalItems;
            this.TotalPage = totalPage;
        
        }
    }
}

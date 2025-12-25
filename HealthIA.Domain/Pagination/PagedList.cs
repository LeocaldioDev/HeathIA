using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Domain.Pagination
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> itens, int pageNumber, int pagesize, int count)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pagesize);
            Pagesize = pagesize;
            TotalCount = count;
            AddRange(itens);
        }

        public PagedList(IEnumerable<T> itens, int currentPage, int totalPages, int pagesize, int totalCount)
        {
            CurrentPage = currentPage;
            TotalPages = totalPages;
            Pagesize = pagesize;
            TotalCount = totalCount;
            AddRange(itens);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int Pagesize { get; set; }
        public int TotalCount { get; set; }




    }

}

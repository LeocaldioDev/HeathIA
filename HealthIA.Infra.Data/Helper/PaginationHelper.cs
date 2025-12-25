using HealthIA.Domain.Pagination;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace HealthIA.Infra.Data.Helper
{
    public static class PaginationHelper
    {
        public static async Task<PagedList<T>> CreateAsync<T>
            (IQueryable<T> source, int PageNumber, int PageSize) where T : class
        {
            var count = await source.CountAsync();
            var items = await source.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToListAsync();
            return new PagedList<T>(items, PageNumber, PageSize, count);
        }
    }
}

using BLL.Dto;
using DAL.Entities;

namespace BLL.Interface;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<IEnumerable<Product>> GetFilteredProductAsync(decimal? minPrice, decimal? maxPrice, string? name);
    Task<ProductCreateDto> GetProductByIdAsync(int id);
    public Task UpdateProductStockAsync(int productId, int newStockQuantity);
    public Task<Product?> GetProductEntityByIdAsync(int id);
    Task AddProductAsync(ProductCreateDto productDto);
    Task UpdateProductAsync(int id, ProductUpdateDto updateDto);
    Task DeleteProductAsync(int id);
}
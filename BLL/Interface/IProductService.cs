using BLL.Dto;
using DAL.Entities;

namespace BLL.Interface;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<ProductCreateDto> GetProductByIdAsync(int id);
    Task AddProductAsync(ProductCreateDto productDto);
    Task UpdateProductAsync(int id, ProductUpdateDto updateDto);
    Task DeleteProductAsync(int id);
}
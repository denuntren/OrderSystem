using AutoMapper;
using BLL.Dto;
using BLL.Interface;
using DAL.Entities;
using DAL.Interface;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _productRepository;
    private readonly IMapper _mapper;

    public ProductService(IRepository<Product> productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    private bool IsValidProductName(string productName)
    {
        if (string.IsNullOrWhiteSpace(productName))
            return true; 

        return !(productName.Contains("'") || productName.Contains("--") || productName.Contains(";"));
    }


    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _productRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Product>> GetFilteredProductAsync(decimal? minPrice, decimal? maxPrice, string? name)
    {
        var query = _productRepository.GetAllAsync().Result.AsQueryable();
        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);
        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(p => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
        var products =  query.ToList();
        return products;
    }
    
    public async Task<ProductCreateDto> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : _mapper.Map<ProductCreateDto>(product);
    }

    public async Task<Product?> GetProductEntityByIdAsync(int id)
    {
        return await _productRepository.GetByIdAsync(id);
    }
    
    public async Task AddProductAsync(ProductCreateDto productDto)
    {
        // Перевірка вхідних даних
        if (!IsValidProductName(productDto.Name))
        {
            throw new Exception("Invalid product name detected.");
        }

        var product = _mapper.Map<Product>(productDto);
        product.ImageUrl = productDto.ImageUrl ?? "https://via.placeholder.com/150";
        await _productRepository.AddAsync(product);
    }

    public async Task UpdateProductStockAsync(int productId, int newStockQuantity)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            throw new Exception("Product not found");

        if (newStockQuantity < 0)
            throw new Exception("Stock quantity cannot be negative");

        product.StockQuantity = newStockQuantity;
        await _productRepository.UpdateAsync(product);
    }

    
    public async Task UpdateProductAsync(int id, ProductUpdateDto updateDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            throw new Exception("Product not found");
        }

        if (updateDto.Name != null && !IsValidProductName(updateDto.Name))
        {
            throw new Exception("Invalid product name detected.");
        }

        if (updateDto.Name != null)
            product.Name = updateDto.Name;

        if (updateDto.Description != null)
            product.Description = updateDto.Description;

        if (updateDto.Price.HasValue)
            product.Price = updateDto.Price.Value;

        if (updateDto.StockQuantity.HasValue)
            product.StockQuantity = updateDto.StockQuantity.Value;

        if (updateDto.ImageUrl != null)
            product.ImageUrl = updateDto.ImageUrl;

        await _productRepository.UpdateAsync(product);
    }

    
    public async Task DeleteProductAsync(int id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
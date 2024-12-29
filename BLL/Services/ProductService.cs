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
        return !(productName.Contains("'") || productName.Contains("--") || productName.Contains(";"));
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _productRepository.GetAllAsync();
    }

    public async Task<ProductCreateDto> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : _mapper.Map<ProductCreateDto>(product);
    }

    public async Task AddProductAsync(ProductCreateDto productDto)
    {
        // Перевірка вхідних даних
        if (!IsValidProductName(productDto.Name))
        {
            throw new Exception("Invalid product name detected.");
        }

        var product = _mapper.Map<Product>(productDto);
        await _productRepository.AddAsync(product);
    }

    public async Task UpdateProductAsync(int id, ProductUpdateDto updateDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            throw new Exception("Product not found");
        }

        // Перевірка вхідних даних
        if (!IsValidProductName(updateDto.Name))
        {
            throw new Exception("Invalid product name detected.");
        }

        _mapper.Map(updateDto, product);
        await _productRepository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
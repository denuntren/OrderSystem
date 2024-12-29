using AutoMapper;
using BLL.Dto;
using DAL.Entities;

namespace BLL.Mappers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        
        CreateMap<ProductCreateDto, Product>();
        CreateMap<ProductUpdateDto, Product>();
        CreateMap<Product, ProductCreateDto>();
    }
}
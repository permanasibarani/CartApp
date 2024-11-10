package backend_cartapp.cart_app.controller;

import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.CreateProductRequest;
import backend_cartapp.cart_app.model.ProductResponse;
import backend_cartapp.cart_app.model.WebResponse;
import backend_cartapp.cart_app.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping(
            path = "api/v1/product",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public WebResponse<ProductResponse> create(User user, @RequestBody CreateProductRequest request){
        ProductResponse productResponse = productService.create(user, request);
        return WebResponse.<ProductResponse>builder().data(productResponse).build();
    }

    @GetMapping(
            path = "api/v1/product/all",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public WebResponse<List<ProductResponse>> getAllProducts(User user) {
        List<ProductResponse> products = productService.getAllProducts(user);
        return WebResponse.<List<ProductResponse>>builder().data(products).build();
    }
}

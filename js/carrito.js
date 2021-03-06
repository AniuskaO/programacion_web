const compraBoleta = document.getElementById('#productos-boleta');

class Carrito {

    //Añadir producto al carrito
    comprarProducto(e){
        e.preventDefault();
        //Delegado para agregar al carrito
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
            //Enviamos el producto seleccionado para tomar sus datos
            this.leerDatosProducto(producto);
        }
    }

    //Leer datos del producto
    leerDatosProducto(producto){
        console.log(producto);
        const infoProducto = {
            imagen : producto.querySelector('#imagen_producto').src,
            nombre: producto.querySelector('#nombre_producto').textContent,
            valor_venta: producto.querySelector('.precio span').textContent,
            id_producto: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id_producto === infoProducto.id_producto){
                productosLS = productoLS.id_producto;
            }
        });

        if(productosLS === infoProducto.id_producto){
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 1000
            })
        }
        else {
            this.insertarCarrito(infoProducto);
        }
        
    }

    //muestra producto seleccionado en carrito
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.nombre}</td>
            <td>${producto.valor_venta}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id_producto}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

    //Eliminar el producto del carrito en el DOM
    eliminarProducto(e){
        e.preventDefault();
        let producto, id_producto;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            id_producto = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(id_producto);
        this.calcularTotal();

    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Almacenar en el LS
    guardarProductosLocalStorage(producto){
        let productos;
        //Toma valor de un arreglo con datos del LS
        productos = this.obtenerProductosLocalStorage();
        //Agregar el producto al carrito
        productos.push(producto);
        //Agregamos al LS
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let productoLS;

        //Comprobar si hay algo en LS
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //Mostrar los productos guardados en el LS
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.valor_venta}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id_producto}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
            
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.valor_venta}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.valor_venta * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id_producto}"></a>
                </td>
            `;
            listaCompra.appendChild(row);            
    
            
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(id_producto){
        let productosLS;
        //Obtenemos el arreglo de productos
        productosLS = this.obtenerProductosLocalStorage();
        console.log(productosLS)
        
        //Comparar el id del producto borrado con LS
        productosLS.forEach(function(productoLS, index){
            console.log(id_producto);
            if(productoLS.id_producto == id_producto){
                productosLS.splice(index, 1);
                console.log(productosLS)
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
 
    }

    //Procesar pedido
    procesarPedido(e){
        e.preventDefault();

        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let productosLS;
        let total = 0, iva = 0, subtotal = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let element = Number(productosLS[i].valor_venta * productosLS[i].cantidad);
            total = total + element;
            
        }
        
        iva = parseFloat(total * 0.19).toFixed(2);
        subtotal = parseFloat(total-iva).toFixed(2);

        document.getElementById('subtotal').innerHTML = "$ " + subtotal;
        document.getElementById('iva').innerHTML = "$ " + iva;
        document.getElementById('total').value = "$ " + total.toFixed(2);

        $(document).on('click','#procesar-compra',function(){

            $('#botonBoleta').show();

            //var descuento= 0;
            var sub_total = subtotal;
            var totalV = total;
            var ivaV = iva;
            //var estado = "V";
            //var cliente_id = 1;
            //var vendedor_id = 1;
            //var despacho_id = 1;

            var rut = $('#inputRut').val();
            var dv = $('#inputDv').val();
            var primer_nombre = $('#inputPrimerNombre').val();
            var segundo_nombre = $('#inputSegundoNombre').val();
            var primer_apellido = $('#inputPrimerApellido').val();
            var segundo_apellido = $('#inputSegundoApellido').val();
            var direccion = $('#inputDireccion').val();
            var region_id = $('#InputRegion').val();
            var comuna_id = $('#InputComuna').val();
            var fono = $('#inputFono').val();
            var correo = $('#inputCorreo').val();
            //var clave = '';
            var nombre_recibe = primer_nombre + ' ' + primer_apellido;
           // var estado_despacho = 'V';
            //var venta_id = 1;
            var rut_recibe = rut;

            $.ajax({
                url: API_URL+'/compra',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    rut: rut,
                    dv: dv,
                    primer_nombre: primer_nombre,
                    segundo_nombre: segundo_nombre,
                    primer_apellido: primer_apellido,
                    segundo_apellido: segundo_apellido, 
                    direccion: direccion,
                    fono: fono,
                    correo: correo, 
                    comuna_id: comuna_id,
                    sub_total: sub_total,
                    iva: ivaV,
                    total: totalV, 
                    rut_recibe: rut_recibe,
                    nombre_recibe: nombre_recibe

                }),
                success: function(respuesta){
                    console.log(sub_total, iva, total);
                }
            })
        
            /*
                $.ajax({
                    url: API_URL+'/ventas',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        fecha: fecha,
                        descuento: descuento,
                        sub_total: sub_total,
                        iva: ivaV,
                        total: totalV,
                        estado: estado, 
                        cliente_id: cliente_id,
                        vendedor_id: vendedor_id,
                        despacho_id: despacho_id
                    }),
                    success: function(respuesta){
                        console.log(respuesta);
                    }
                })

                $.ajax({
                    url: API_URL+'/clientes',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      rut: rut,
                      dv: dv,
                      primer_nombre: primer_nombre,
                      segundo_nombre: segundo_nombre,
                      primer_apellido: primer_apellido,
                      segundo_apellido: segundo_apellido, 
                      direccion: direccion,
                      fono: fono,
                      correo: correo, 
                      comuna_id: comuna_id,
                      region_id: region_id, 
                      clave: clave
                    }),
                    success: function(respuesta){
                        console.log(respuesta);
                        actualizarTabla();
                    }
                })
        
                $.ajax({
                    url: API_URL+'/despachos',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      direccion: direccion,
                      nombre_recibe: nombre_recibe,
                      estado_despacho: estado_despacho,
                      venta_id: venta_id, 
                      direccion: direccion,
                      comuna_id: comuna_id,
                      region_id: region_id, 
                      clave: clave
                    }),
                    success: function(respuesta){
                        console.log(respuesta);
                        actualizarTabla();
                    }
                })

            return false;
            */
        
               
        });
       
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id_producto, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id_producto = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id_producto === id_producto) {
                    productoLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].valor_venta);
                    console.log()
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
            
        }
        else {
            console.log("click afuera");
        }
    }
}


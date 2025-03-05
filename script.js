const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")  
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir modal do carrinho ao clicar no botão
cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar modal do carrinho ao clicar fora do modal ou no botão fechar
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adicionar item ao carrinho e atualizar contador
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }
})

// Adicionar item ao carrinho
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        existingItem.quantity += 1
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
            })
    }

    updateCartModal()
}

// Atualiza o carrinho na tela
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col" )
     
        cartItemElement.innerHTML = ` 
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd:${item.quantity}</p>
                    <p class"font-medium mt-2">$${item.price}</p>
                </div>      
                
             
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
               
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    
    })

    cartTotal.textContent = total.toLocaleString("pt-Br",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

// função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];
    

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    
    }

}

// 

addressInput.addEventListener("input", function(){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

checkoutBtn.addEventListener("click", function(){

    const isOppen = checkRestauranteOppen();
    if(!isOppen) {
        
        Toastify({
            text: "Ops nós estamos fechados no momento. Entre em contato com nosso atendimento para mais informações.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
      addressWarn.classList.remove("hidden"); 
      addressInput.classList.add("border-red-500");
      return;
    }

    // enviar pedido pelo whatsapp

    const cartItems = cart.map((item) => {
       return (
        `${item.name} - Quantidade: (${item.quantity}) - Preço: $${item.price} |`
        )
           
    }).join("");

    const message = encodeURIComponent(cartItems)
    const phone = "61998547716"

    window.open(`https://wa.me//${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank"  )

    cart = [];
    updateCartModal();

})

//  verificar a hora e manipular o card horario
function checkRestauranteOppen() {
    const data = new Date();
    const hours = data.getHours();
    return hours >= 18 && hours < 20;
}

const spanItem = document.getElementById("date-span");
const isOppen = checkRestauranteOppen();

if(isOppen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}




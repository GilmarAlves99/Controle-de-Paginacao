
const data = Array.from({ length: 1000 })
    .map((_, index) => `Item ${(index + 1)}`);

//========================================== pra cima vem do back


//auxiliar 

let perPage = 10;
const state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5
}

const html = {
    get(element) {
        return document.querySelector(element)
    }
}
/* console.log(`Total de Paginas ${state.totalPage}`) */
//ir pra frente = next
const controls = {
    next() {
        state.page++;

        // Verificando se passou da ultima pagina
        const lastPage = state.page > state.totalPage;
        if (lastPage) {
            state.page--;
        }
    },
    // ir para pagina anterior
    prev() {
        state.page--;

        //verificando se a pagina é menor que 1 para nao ir para o 0
        if (state.page < 1) {
            state.page++;
        }
    },
    // mandando para pagina 1 ou 20
    goTo(page) {
        //verificando se a pagina é menor que 1
        if (page < 1) {
            page = 1;
        }
        state.page = +page;

        //verificando se a pagina é maior que o toal de pagina
        if (page > state.totalPage) {
            //se for total joga pra ultima pagina eistente
            state.page = state.totalPage
        }
    },

    // criando um evento para todos os elementos acima
    createListener() {
        // aqui fara que quando clique no botao << va para primeira pagina
        html.get('.first').addEventListener('click', () => {
            controls.goTo(1)
            update()
        })


        // aqui fara que quando clique no botao >> va para ultima pagina
        html.get('.last').addEventListener('click', () => {
            controls.goTo(state.totalPage)
            update()
        })



        // aqui fara que quando clique no botao > va para a proxima pagina
        html.get('.next').addEventListener('click', () => {
            controls.next()
            update()
        })


        // aqui fara que quando clique no botao < volte a pagina
        html.get('.prev').addEventListener('click', () => {
            controls.prev()
            update()
        })
    }

}

const list = {
    create(item) {
        console.log(item)
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = item;

        html.get('.list').appendChild(div)
    },
    update() {
        html.get('.list').innerHTML = ""
        let page = state.page - 1;
        let start = page * state.perPage;
        let end = start + state.perPage;

        const paginatedItems = data.slice(start, end)
        paginatedItems.forEach(list.create)

    }
}

const buttons = {
    element: html.get('.pagination .numbers'),
    create(number) {
        const button = document.createElement('div')
        button.innerHTML = number;

        if (state.page == number) {
            button.classList.add('active')
        }

        button.addEventListener('click', (event) => {
            const page = event.target.innerText
            controls.goTo(page)
            update();
        })


        buttons.element.appendChild(button)

    },
    update() {
        buttons.element.innerHTML = "";
        const { maxLeft, maxRight } = buttons.calculateMaxVisible();
        console.log(maxLeft, maxRight)


        for (let page = maxLeft; page <= maxRight; page++) {
            buttons.create(page)
            console.log(page)
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))


        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        }
        if (maxRight > state.totalPage) {
            maxLeft = state.totalPage - (maxVisibleButtons - 1)
            maxRight = state.totalPage

            if (maxLeft < 1) {
                maxLeft = 1
            }
        }
        return { maxLeft, maxRight }



    }
}


function update() {
    console.log(`Local da pagina: ${state.page}`)
    list.update();
    buttons.update();
}

function init() {
    update()
    controls.createListener();
}

init();

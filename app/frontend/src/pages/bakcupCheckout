import React, { useContext } from 'react';
import AppContext from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Table from '../components/Table';

function Checkout() {
  const params = useContext(AppContext);

  const cart = params.cartItens.map((item, index) => {
    if (item.qnt === 0) return null;
    const { name, qnt, subTotal } = item;
    const qntNumber = (Number(qnt));
    const value = Number(subTotal.replace(',', '.'));
    return (
      <Table
        key={ index }
        index={ index }
        name={ name }
        qnt={ qntNumber }
        unitValue={ subTotal }
        value={ value }
      />
    );
  });

  return (
    <div>
      <Header />
      <div>
        <h3>Finalizar Pedido</h3>
        {
          cart
        }
        {/* <h1>{ `Total: R$ ${total}` }</h1> */}
        <div />
      </div>
    </div>
  );
}

export default Checkout;

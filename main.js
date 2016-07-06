
var ProductCategoryRow = React.createClass({
  render () {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
})

var ProductRow = React.createClass({
  render () {
    console.log(this.props)
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td id="item">{name}</td>
        <td id="item">{this.props.product.price}</td>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  render () {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    }.bind(this));
    return (
      <table>
        <thead>
          <tr>
            <th id="np">Name</th>
            <th id="np">Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var SearchBar = React.createClass({
  render () {
    return (
      <form>
        <input type="text" placeholder="Search..." id="search" value={this.props.filterText} />
        <p>
          <input type="checkbox" checked={this.props.inStockOnly}/>
          {' '}
          Only show products in stock
        </p>
        <button type='button'>
          Hide/Show
        </button>
      </form>
    );
  }
});

var FilterableProductTable = React.createClass({
  getInitialState () {
    return {
      filterText: '',
      inStockOnly: false,
      hide: false
    }
  },
  render () {
    return (
      <div id="FilterableProductTable">
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
});

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);

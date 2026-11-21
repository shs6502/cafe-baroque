import { useState } from 'react'
import './App.css'

type Category = '커피' | '음료' | '디저트'
type CategoryFilter = '전체' | Category

type MenuItem = {
  id: number
  name: string
  category: Category
  price: number
  description: string
  icon: string
}

type CartItem = MenuItem & { quantity: number }

const categories: CategoryFilter[] = ['전체', '커피', '음료', '디저트']

const menu: MenuItem[] = [
  { id: 1, name: '아메리카노', category: '커피', price: 4500, description: '고소하고 깔끔한 오늘의 블렌드', icon: '☕' },
  { id: 2, name: '카페라떼', category: '커피', price: 5000, description: '에스프레소와 부드러운 우유', icon: '🥛' },
  { id: 3, name: '바닐라 라떼', category: '커피', price: 5500, description: '은은한 바닐라 향을 더한 라떼', icon: '🤎' },
  { id: 4, name: '말차 라떼', category: '음료', price: 5500, description: '진한 말차와 고소한 우유', icon: '🍵' },
  { id: 5, name: '레몬 에이드', category: '음료', price: 5800, description: '상큼하게 즐기는 수제 레몬 에이드', icon: '🍋' },
  { id: 6, name: '딸기 스무디', category: '음료', price: 6000, description: '새콤달콤한 딸기를 가득 담아', icon: '🍓' },
  { id: 7, name: '바스크 치즈케이크', category: '디저트', price: 6500, description: '겉은 진하게, 속은 촉촉하게', icon: '🍰' },
  { id: 8, name: '초코 쿠키', category: '디저트', price: 3200, description: '초콜릿 청크가 콕콕 박힌 쿠키', icon: '🍪' },
  { id: 9, name: '크루아상', category: '디저트', price: 4200, description: '매일 아침 구워 바삭한 버터 풍미', icon: '🥐' },
]

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('전체')
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderComplete, setOrderComplete] = useState(false)

  const visibleMenu =
    selectedCategory === '전체'
      ? menu
      : menu.filter((item) => item.category === selectedCategory)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(item: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }
      return [...currentCart, { ...item, quantity: 1 }]
    })
    setOrderComplete(false)
  }

  function removeFromCart(itemId: number) {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== itemId) return [item]
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
      }),
    )
    setOrderComplete(false)
  }

  function placeOrder() {
    if (cart.length === 0) return
    setCart([])
    setOrderComplete(true)
  }

  return (
    <main className="cafe-app">
      <header className="cafe-header">
        <a className="brand" href="#" aria-label="온기 카페 홈">
          <span className="brand-mark" aria-hidden="true">온</span>
          <span>온기 <span className="brand-subtitle">COFFEE & DESSERT</span></span>
        </a>
        <span className="header-note">오늘도 따뜻한 한 잔</span>
      </header>

      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow">A LITTLE MOMENT OF WARMTH</p>
          <h1 id="welcome-title">잠시 쉬어가도 괜찮아요.</h1>
          <p className="welcome-description">
            정성껏 내린 커피와 달콤한 디저트로 오늘의 여유를 채워보세요.
          </p>
        </div>
        <div className="welcome-art" aria-hidden="true">☕</div>
      </section>

      <div className="shop-layout">
        <section className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MADE WITH CARE</p>
              <h2 id="menu-title">오늘의 메뉴</h2>
            </div>
            <span className="menu-count">{visibleMenu.length}가지 메뉴</span>
          </div>

          <div className="category-tabs" role="group" aria-label="메뉴 카테고리">
            {categories.map((category) => (
              <button
                className={`category-tab${selectedCategory === category ? ' is-selected' : ''}`}
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {visibleMenu.map((item) => (
              <article className="menu-card" key={item.id}>
                <div className={`menu-art category-${item.category}`} aria-hidden="true">
                  {item.icon}
                </div>
                <div className="menu-card-content">
                  <span className="menu-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p className="menu-description">{item.description}</p>
                  <div className="menu-card-footer">
                    <strong>{formatPrice(item.price)}</strong>
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => addToCart(item)}
                      aria-label={`${item.name} 담기`}
                    >
                      담기 <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart-panel" aria-labelledby="cart-title">
          <div className="cart-heading">
            <div>
              <p className="eyebrow">YOUR SELECTION</p>
              <h2 id="cart-title">장바구니</h2>
            </div>
            <span className="cart-count" aria-label={`총 ${cartCount}개`}>
              {cartCount}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span aria-hidden="true">🧺</span>
              <p>아직 담긴 메뉴가 없어요.</p>
              <small>마음에 드는 메뉴를 담아보세요.</small>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-item-icon" aria-hidden="true">{item.icon}</div>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)} · {item.quantity}개</span>
                  </div>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`${item.name} 하나 빼기`}
                  >
                    빼기
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-total">
            <span>합계</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            className="order-button"
            type="button"
            onClick={placeOrder}
            disabled={cart.length === 0}
          >
            주문하기 <span aria-hidden="true">→</span>
          </button>
          {orderComplete && (
            <p className="order-message" role="status">
              주문이 완료되었습니다
            </p>
          )}
        </aside>
      </div>

      <footer className="cafe-footer">
        매일의 작은 쉼표, 온기에서 만나요.
      </footer>
    </main>
  )
}

export default App

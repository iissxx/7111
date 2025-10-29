import React, { useState, useEffect, useCallback } from "react";
import { CartItem, User, Product } from "./types";
import { findProductById } from "./constants";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import CartModal from "./components/CartModal";
import AuthModal from "./components/AuthModal";
import CheckoutModal from "./components/CheckoutModal";
import StaticPage from "./components/StaticPage";

const App: React.FC = () => {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("codestan_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      localStorage.removeItem("codestan_cart");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("codestan_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);
  
  const handleSetView = (newView: string) => {
    window.scrollTo(0, 0);
    setView(newView);
  }

  const addToCart = (productId: number) => {
    const product = findProductById(productId);
    if (!product) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const registerUser = (newUser: User) => {
    setUser(newUser);
    handleSetView("checkout");
  };

  const clearCartAndClose = () => {
      setCart([]);
      setUser(null);
      handleSetView('home');
  }

  const renderPage = () => {
    if (view === 'privacy') {
        return <StaticPage 
            setView={handleSetView} 
            title="سياسة الخصوصية"
            content={`
                <h2>مقدمة</h2>
                <p>نحن في كودستان نحترم خصوصيتك ونلتزم بحمايتها. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.</p>
                <h2>المعلومات التي نجمعها</h2>
                <p>عند التسجيل لإتمام الطلب، نطلب منك تقديم معلومات شخصية مثل:</p>
                <ul>
                    <li>الاسم الكامل</li>
                    <li>عنوان البريد الإلكتروني</li>
                    <li>رقم الهاتف</li>
                    <li>البلد والجنس</li>
                </ul>
                <h2>كيف نستخدم معلوماتك</h2>
                <p>نستخدم المعلومات التي نجمعها فقط لغرض إتمام طلباتك والتواصل معك بشأنها. لا نشارك معلوماتك مع أي طرف ثالث.</p>`}
        />
    }
     if (view === 'terms') {
        return <StaticPage 
            setView={handleSetView} 
            title="شروط الاستخدام"
            content={`
                <h2>قبول الشروط</h2>
                <p>باستخدامك لموقع متجر كودستان، فإنك توافق على الالتزام بشروط وأحكام الاستخدام هذه.</p>
                <h2>الخدمات</h2>
                <p>جميع الخدمات المقدمة في المتجر تتم وفقًا للأوصاف المذكورة. قد تختلف أوقات التنفيذ بناءً على الخدمة المطلوبة. نحن نضمن تقديم الخدمات بأعلى جودة ممكنة.</p>
                <h2>الدفع والأسعار</h2>
                <p>الأسعار الموضحة بالريال اليمني وهي نهائية. يتم إتمام عملية الطلب عبر واتساب أو البريد الإلكتروني، وسيتم تزويدك بتفاصيل الدفع لاحقًا.</p>
                <h2>إخلاء المسؤولية</h2>
                <p>كودستان غير مسؤولة عن أي استخدام غير قانوني للخدمات المقدمة. يتحمل العميل المسؤولية الكاملة عن كيفية استخدام الحسابات أو الخدمات بعد تسليمها.</p>`}
        />
    }
    return <HomePage view={view} setView={handleSetView} addToCart={addToCart} />
  }

  return (
    <>
      <Header cartItemCount={getCartItemCount()} setView={handleSetView} />
      {renderPage()}
      <Footer setView={handleSetView} />

      {view === "cart" && (
        <CartModal
          cart={cart}
          getCartTotal={getCartTotal}
          setView={handleSetView}
          updateCartQuantity={updateCartQuantity}
        />
      )}

      {view === "auth" && (
        <AuthModal setView={handleSetView} registerUser={registerUser} />
      )}

      {view === "checkout" && user && (
        <CheckoutModal
          user={user}
          cart={cart}
          getCartTotal={getCartTotal}
          setView={handleSetView}
          clearCartAndClose={clearCartAndClose}
        />
      )}
    </>
  );
};

export default App;

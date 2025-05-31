import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import NewArrivals from '../NewArrivals';
import { act } from 'react';

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: function MockSwiper({ children, breakpoints, pagination, autoplay, modules, className }) { 
    return (
      <div 
        data-testid="swiper-mock" 
        data-breakpoints={JSON.stringify(breakpoints)}
        data-pagination={JSON.stringify(pagination)}
        data-autoplay={JSON.stringify(autoplay)}
        className={className}
      >
        {children}
      </div>
    ); 
  },
  SwiperSlide: function MockSwiperSlide({ children }) { 
    return <div data-testid="swiper-slide-mock">{children}</div>; 
  }
}));

// Mock Swiper styles
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/modules', () => ({
  Autoplay: function MockAutoplay() {},
  Pagination: function MockPagination() {}
}));

// Mock ShopContext with 7 books to test the slice and reverse
const mockBooks = [
  { _id: '1', name: 'Book 1', img: 'img1.jpg', price: 19.99 },
  { _id: '2', name: 'Book 2', img: 'img2.jpg', price: 29.99 },
  { _id: '3', name: 'Book 3', img: 'img3.jpg', price: 39.99 },
  { _id: '4', name: 'Book 4', img: 'img4.jpg', price: 49.99 },
  { _id: '5', name: 'Book 5', img: 'img5.jpg', price: 59.99 },
  { _id: '6', name: 'Book 6', img: 'img6.jpg', price: 69.99 },
  { _id: '7', name: 'Book 7', img: 'img7.jpg', price: 79.99 },
  { _id: '8', name: 'Book 8', img: 'img8.jpg', price: 89.99 }
];

// Mock the Item component used by NewArrivals
jest.mock('../Item', () => {
  return function MockItem({ book }) {
    return <div data-testid="item-mock">{book.name}</div>;
  };
});

// Mock useState to verify state changes
const mockSetState = jest.fn();
const originalUseState = React.useState;

describe('NewArrivals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the title correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    expect(screen.getByText('Novos')).toBeInTheDocument();
    expect(screen.getByText('Lançamentos')).toBeInTheDocument();
  });

  test('renders swiper container with correct props', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    const swiperContainer = screen.getByTestId('swiper-mock');
    expect(swiperContainer).toBeInTheDocument();
    
    // Verify swiper props
    const breakpoints = JSON.parse(swiperContainer.dataset.breakpoints);
    expect(breakpoints).toHaveProperty('400');
    expect(breakpoints).toHaveProperty('700');
    expect(breakpoints).toHaveProperty('1024');
    expect(breakpoints).toHaveProperty('1200');
    
    const pagination = JSON.parse(swiperContainer.dataset.pagination);
    expect(pagination.clickable).toBe(true);
    expect(pagination.dynamicBullets).toBe(true);
    
    const autoplay = JSON.parse(swiperContainer.dataset.autoplay);
    expect(autoplay.delay).toBe(3500);
    expect(autoplay.disableOnInteraction).toBe(false);
  });
  
  test('renders correct number of book items', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    // Should have 7 items (the component slices first 7 books)
    await waitFor(() => {
      const bookItems = screen.getAllByTestId('item-mock');
      expect(bookItems).toHaveLength(7);
    });
  });
  
  test('handles empty books array gracefully', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: [] }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    const swiperContainer = screen.getByTestId('swiper-mock');
    expect(swiperContainer).toBeInTheDocument();
    expect(screen.queryAllByTestId('item-mock')).toHaveLength(0);
  });

  test('correctly slices and reverses the books array', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    // Verify that the correct first book is displayed (reversed order)
    await waitFor(() => {
      const firstBookItem = screen.getAllByTestId('item-mock')[0];
      expect(firstBookItem.textContent).toBe('Book 7');
    });
    
    // Check if the displayed books are in reversed order (7 to 1)
    const bookItems = screen.getAllByTestId('item-mock');
    expect(bookItems).toHaveLength(7);
    expect(bookItems[0].textContent).toBe('Book 7');
    expect(bookItems[1].textContent).toBe('Book 6');
    expect(bookItems[2].textContent).toBe('Book 5');
    expect(bookItems[6].textContent).toBe('Book 1');
  });

  test('handles book data updates correctly', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <ShopContext.Provider value={{ books: mockBooks.slice(0, 3) }}>
          <NewArrivals />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const bookItems = screen.getAllByTestId('item-mock');
      expect(bookItems).toHaveLength(3);
    });

    // Update with more books
    await act(async () => {
      rerender(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });

    // Should now have 7 items
    await waitFor(() => {
      const bookItems = screen.getAllByTestId('item-mock');
      expect(bookItems).toHaveLength(7);
    });
  });

  test('renders correct animation styles', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContext.Provider value={{ books: mockBooks }}>
            <NewArrivals />
          </ShopContext.Provider>
        </BrowserRouter>
      );
    });
    
    const slideElements = screen.getAllByTestId('swiper-slide-mock');
    
    // Check animation class
    for (let i = 0; i < slideElements.length; i++) {
      const animatedDiv = slideElements[i].querySelector('div');
      expect(animatedDiv).toHaveClass('animate-slideInRight');
      expect(animatedDiv).toHaveClass('opacity-0');
      expect(animatedDiv).toHaveClass('[animation-fill-mode:forwards]');
      expect(animatedDiv.style.animationDelay).toBeDefined();
    }
  });
});

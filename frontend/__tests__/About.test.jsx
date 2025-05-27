import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../src/components/About';

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('renders the main title correctly', () => {
    expect(screen.getByText("Unveiling Our")).toBeInTheDocument();
    expect(screen.getByText("Store's key features!")).toBeInTheDocument();
  });

  test('renders all feature sections', () => {
    // Check all feature headings
    expect(screen.getByText('Easy Returns Process')).toBeInTheDocument();
    expect(screen.getByText('Secure Payment Options')).toBeInTheDocument();
    expect(screen.getByText('Live Customer Support')).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    // Check if all TbTruckReturn icons are rendered
    const icons = document.querySelectorAll('.text-2xl');
    expect(icons).toHaveLength(3);
  });

  test('renders about image', () => {
    const image = screen.getByAltText('aboutImg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('height', '244');
    expect(image).toHaveAttribute('width', '244');
  });

  test('has correct styling classes', () => {
    // Check for main section styling
    expect(document.querySelector('.max-padd-container')).toBeInTheDocument();
    expect(document.querySelector('.py-12')).toBeInTheDocument();
    
    // Check for feature container styling
    const featureContainers = document.querySelectorAll('.flexCenter.gap-x-4');
    expect(featureContainers).toHaveLength(3);

    // Check for image container styling
    expect(document.querySelector('.bg-secondaryOne.flexCenter.p-24')).toBeInTheDocument();
  });

  test('renders all feature descriptions', () => {
    const descriptions = screen.getAllByText(
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo facere fugiat officiis veritatis.'
    );
    expect(descriptions).toHaveLength(3);
  });
});
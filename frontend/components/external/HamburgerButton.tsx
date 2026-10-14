import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

interface HamburgerButtonProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
}

const HamburgerButton = ({ setExpanded, expanded }: HamburgerButtonProps) => {
  return (
    <StyledWrapper>
      <div className="flex items-center justify-center h-full">
        <input id="checkbox" type="checkbox" checked={expanded} onChange={() => setExpanded((current) => !current)} />
        <label className="toggle" htmlFor="checkbox">
          <div id="bar1" className="bars" />
          <div id="bar2" className="bars" />
          <div id="bar3" className="bars" />
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    margin-left: 20px;
    position: relative;
    width: 18px;
    height: 18px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition-duration: .3s;
  }

  .bars {
    width: 100%;
    height: 2px;
    background-color: var(--foreground);
    border-radius: 5px;
    transition-duration: .3s;
  }

  /* #checkbox:checked + .toggle .bars {
    margin-left: 13px;
  } */

  #checkbox:checked + .toggle #bar2 {
    transform: translateY(6px) rotate(60deg);
    margin-left: 0;
    transform-origin: right;
    transition-duration: .3s;
    z-index: 2;
  }

  #checkbox:checked + .toggle #bar1 {
    transform: translateY(12px) rotate(-60deg);
    transition-duration: .3s;
    transform-origin: left;
    z-index: 1;
  }

  #checkbox:checked + .toggle {
    transform: rotate(-90deg);
  }
  /* #checkbox:checked + .toggle #bar3 {
    transform: rotate(90deg);
    transition-duration: .3s;
    transform-origin:right;
  } */`;

export default HamburgerButton;

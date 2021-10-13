export default function CustomBootstrapStyle() {
  return (
    <style type="text/css">
      {`
    .btn:focus, .btn:active {
        outline: none !important;
        outline-offset: none !important;
        box-shadow: none !important;
    }

    .btn-primary {
        background-color: #8F6B58;
        color: #white;
        border-color: #8F6B58;
    }

    .btn-primary:hover {
        background-color: #725546;
        color: white;
        border-color: #725546;
    }

    .btn-outline-primary {
      color: #8F6B58;
      border-color: #8F6B58;
    }

    .btn-outline-primary:hover {
        background-color: #8F6B58;
        color: white;
        border-color: #8F6B58;
    }

    .btn-secondary {
        background-color: #f28f71;
        color: #white;
        border-color: #f28f71;
    }
    
    .btn-secondary:hover {
        background-color: #ed7153;
        color: white;
        border-color: #ed7153;
    }

    .btn-outline-secondary {
      color: #f28f71;
      border-color: #f28f71;
    }

    .btn-outline-secondary:hover {
        background-color: #f28f71;
        color: white;
        border-color: #f28f71;
    }

    .btn-danger {
        background-color: #f65454;
        color: #white;
        border-color: #f65454;
    }
    
    .btn-danger:hover {
        background-color: #d63030;
        color: white;
        border-color: #d63030;
    }

    .btn-outline-danger {
      color: #f65454;
      border-color: #f65454;
    }

    .btn-outline-danger:hover {
        background-color: #f65454;
        color: white;
        border-color: #f65454;
    }

    .btn-outline-facebook {
        color: #3b5998;
        border-color: #3b5998;
      }
  
      .btn-outline-facebook:hover {
          background-color: #3b5998;
          color: white;
          border-color: #3b5998;
      }

    `}
    </style>
  );
}

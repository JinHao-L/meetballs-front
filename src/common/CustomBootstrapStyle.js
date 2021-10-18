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

    .btn-primary:hover, .btn-primary:active, .btn-primary:focus {
      background-color: #725546;
      color: white;
      border-color: #725546;
    }

    .btn-primary:disabled {
      background-color: #8f7c72;
      color: #white;
      border-color: #8f7c72;
    }

    .btn-outline-primary {
      color: #8F6B58;
      border-color: #8F6B58;
    }

    .btn-outline-primary:hover, .btn-outline-primary:active, .btn-outline-primary:focus {
      background-color: #8F6B58;
      color: white;
      border-color: #8F6B58;
    }

    .btn-outline-primary:disabled {
      color: #8f7c72;
      border-color: #8f7c72;
    }

    .btn-secondary {
      background-color: white;
      color: #8F6B58;
      border-color: #8F6B58;
    }

    .btn-secondary:hover, .btn-secondary:active, .btn-secondary:focus {
      background-color: #725546;
      color: white;
      border-color: #725546;
    }

    .btn-secondary:disabled {
      background-color: #8f7c72;
      color: #white;
      border-color: #8f7c72;
    }

    .btn-danger {
      background-color: #f65454;
      color: #white;
      border-color: #f65454;
    }
    
    .btn-danger:hover, .btn-danger:active, .btn-danger:focus {
      background-color: #d63030;
      color: white;
      border-color: #d63030;
    }

    .btn-danger:disabled {
      background-color: #c96565;
      color: #white;
      border-color: #c96565;
    }

    .btn-outline-danger {
      color: #f65454;
      border-color: #f65454;
    }

    .btn-outline-danger:hover, .btn-outline-danger:active, .btn-outline-danger:focus {
      background-color: #f65454;
      color: white;
      border-color: #f65454;
    }

    .btn-outline-danger:disabled {
      color: #c96565;
      border-color: #c96565;
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

    .btn-zoom {
      background-color: #2D8CFF;
      color: white;
      border-color: #2D8CFF;
    }

    .btn-zoom:hover {
      background-color: #357dd4;
      color: white;
      border-color: #357dd4;
    }

    .bg-primary {
      background-color: #8F6B58!important;
      color: white;
    }

    .bg-secondary {
      background-color: #f28f71!important;
      color: white;
    }

    .bg-success {
      background-color: #4CA982!important;
      color: white;
    }

    .bg-danger {
      background-color: #f65454!important;
      color: white;
    }

    .nav-footer .nav-link {
      color: #8F6B58;
      padding: 0;
    }

    .nav-footer .nav-link:hover {
      color: #000000;
    }

    .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
      color: #8F6B58;
      font-weight: 500;
    }

    .nav-tabs .nav-link {
      color: #c5c5c5;
      font-weight: 500;
    }

 

    `}
    </style>
  );
}

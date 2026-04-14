// ─── BizFlow Data Store ───────────────────────────────────────────────────────
// All data lives in localStorage. Every module reads/writes through these functions.

const DB = {
  clients:      'bizflow_clients',
  products:     'bizflow_products',
  vendors:      'bizflow_vendors',
  orders:       'bizflow_orders',
  invoices:     'bizflow_invoices',
  transactions: 'bizflow_transactions',
  meta:         'bizflow_meta',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function get(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function set(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(prefix) {
  const meta = JSON.parse(localStorage.getItem(DB.meta) || '{}');
  meta[prefix] = (meta[prefix] || 1000) + 1;
  localStorage.setItem(DB.meta, JSON.stringify(meta));
  return `${prefix}-${meta[prefix]}`;
}

function today() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dueDate(days = 15) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Seed Data (runs once on first load) ──────────────────────────────────────

function seedIfEmpty() {
  if (localStorage.getItem('bizflow_seeded')) return;

  set(DB.clients, [
    { id: 'C-1001', name: 'Rahul Traders',     phone: '+91 98765 43210', city: 'Mumbai',     email: 'rahul@traders.com',    createdAt: '10 Jan 2025' },
    { id: 'C-1002', name: 'Amit Stores',        phone: '+91 91234 56789', city: 'Pune',       email: 'amit@stores.com',      createdAt: '15 Jan 2025' },
    { id: 'C-1003', name: 'Sharma Bakery',      phone: '+91 99887 65432', city: 'Nashik',     email: 'sharma@bakery.com',    createdAt: '20 Jan 2025' },
    { id: 'C-1004', name: 'Gupta Foods',        phone: '+91 94567 12345', city: 'Nagpur',     email: 'gupta@foods.com',      createdAt: '25 Jan 2025' },
    { id: 'C-1005', name: 'Singh Enterprises',  phone: '+91 87654 32109', city: 'Aurangabad', email: 'singh@enterprises.com',createdAt: '01 Feb 2025' },
  ]);

  set(DB.vendors, [
    { id: 'V-1001', name: 'ABC Foods',  phone: '+91 98001 12345', email: 'abc@foods.com',  city: 'Mumbai', totalPurchases: 12000 },
    { id: 'V-1002', name: 'XYZ Ltd',    phone: '+91 90002 23456', email: 'xyz@ltd.com',    city: 'Pune',   totalPurchases: 8000  },
    { id: 'V-1003', name: 'Dairy Co',   phone: '+91 95003 34567', email: 'dairy@co.com',   city: 'Nashik', totalPurchases: 5000  },
  ]);

  set(DB.products, [
    { id: 'P-1001', name: 'Flour Bag', sku: 'SKU-001', stock: 50, price: 1200, vendorId: 'V-1001', vendorName: 'ABC Foods' },
    { id: 'P-1002', name: 'Sugar',     sku: 'SKU-002', stock: 12, price: 800,  vendorId: 'V-1002', vendorName: 'XYZ Ltd'  },
    { id: 'P-1003', name: 'Butter',    sku: 'SKU-003', stock: 0,  price: 500,  vendorId: 'V-1003', vendorName: 'Dairy Co' },
    { id: 'P-1004', name: 'Wheat',     sku: 'SKU-004', stock: 80, price: 950,  vendorId: 'V-1001', vendorName: 'ABC Foods'},
    { id: 'P-1005', name: 'Salt',      sku: 'SKU-005', stock: 8,  price: 120,  vendorId: 'V-1002', vendorName: 'XYZ Ltd'  },
  ]);

  const orders = [
    { id: '#1021', clientId: 'C-1001', clientName: 'Rahul Traders',    items: [{ productId: 'P-1001', productName: 'Flour Bag', qty: 2, unitPrice: 1200 }],                                          total: 2400, status: 'Paid',    date: '15 Mar 2025', invoiceId: 'INV-0021' },
    { id: '#1020', clientId: 'C-1002', clientName: 'Amit Stores',      items: [{ productId: 'P-1002', productName: 'Sugar',     qty: 1, unitPrice: 800  }],                                          total: 800,  status: 'Pending', date: '14 Mar 2025', invoiceId: 'INV-0020' },
    { id: '#1019', clientId: 'C-1003', clientName: 'Sharma Bakery',    items: [{ productId: 'P-1004', productName: 'Wheat',     qty: 1, unitPrice: 950  }, { productId: 'P-1001', productName: 'Flour Bag', qty: 1, unitPrice: 1200 }], total: 2150, status: 'Paid', date: '13 Mar 2025', invoiceId: 'INV-0019' },
  ];
  set(DB.orders, orders);

  const invoices = [
    { id: 'INV-0021', orderId: '#1021', clientId: 'C-1001', clientName: 'Rahul Traders',  items: orders[0].items, total: 2400, status: 'Paid',   issueDate: '15 Mar 2025', dueDate: '30 Mar 2025' },
    { id: 'INV-0020', orderId: '#1020', clientId: 'C-1002', clientName: 'Amit Stores',    items: orders[1].items, total: 800,  status: 'Unpaid', issueDate: '14 Mar 2025', dueDate: '29 Mar 2025' },
    { id: 'INV-0019', orderId: '#1019', clientId: 'C-1003', clientName: 'Sharma Bakery',  items: orders[2].items, total: 2150, status: 'Paid',   issueDate: '13 Mar 2025', dueDate: '28 Mar 2025' },
  ];
  set(DB.invoices, invoices);

  set(DB.transactions, [
    { id: 'TXN-001', date: '15 Mar 2025', type: 'received', entity: 'Rahul Traders',   reference: 'INV-0021', amount: 2400, note: 'Order #1021' },
    { id: 'TXN-002', date: '14 Mar 2025', type: 'paid',     entity: 'ABC Foods',        reference: 'PO-041',   amount: 5000, note: 'Stock purchase' },
    { id: 'TXN-003', date: '13 Mar 2025', type: 'expense',  entity: 'Transport',        reference: 'EXP-012',  amount: 300,  note: 'Delivery charges' },
    { id: 'TXN-004', date: '12 Mar 2025', type: 'received', entity: 'Sharma Bakery',    reference: 'INV-0019', amount: 2150, note: 'Order #1019' },
    { id: 'TXN-005', date: '11 Mar 2025', type: 'paid',     entity: 'Dairy Co',         reference: 'PO-040',   amount: 2000, note: 'Stock purchase' },
  ]);

  localStorage.setItem('bizflow_seeded', '1');
}

// ─── CLIENT FUNCTIONS ─────────────────────────────────────────────────────────

const Clients = {
  all() { return get(DB.clients); },

  add(data) {
    const clients = this.all();
    const client = { id: nextId('C'), createdAt: today(), ...data };
    clients.unshift(client);
    set(DB.clients, clients);
    return client;
  },

  update(id, data) {
    const clients = this.all().map(c => c.id === id ? { ...c, ...data } : c);
    set(DB.clients, clients);
  },

  delete(id) {
    set(DB.clients, this.all().filter(c => c.id !== id));
  },

  get(id) { return this.all().find(c => c.id === id); },

  stats(id) {
    const orders = Orders.all().filter(o => o.clientId === id);
    const outstanding = orders.filter(o => o.status === 'Pending').reduce((s, o) => s + o.total, 0);
    return { totalOrders: orders.length, outstanding };
  }
};

// ─── PRODUCT / INVENTORY FUNCTIONS ───────────────────────────────────────────

const Products = {
  all() { return get(DB.products); },

  add(data) {
    const products = this.all();
    const product = { id: nextId('P'), ...data };
    products.unshift(product);
    set(DB.products, products);
    return product;
  },

  update(id, data) {
    const products = this.all().map(p => p.id === id ? { ...p, ...data } : p);
    set(DB.products, products);
  },

  delete(id) {
    set(DB.products, this.all().filter(p => p.id !== id));
  },

  get(id) { return this.all().find(p => p.id === id); },

  adjustStock(id, qty) {
    // qty is negative for deduction (order placed), positive for addition (vendor purchase)
    const products = this.all().map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + qty);
        return { ...p, stock: newStock };
      }
      return p;
    });
    set(DB.products, products);
  },

  stockStatus(stock) {
    if (stock === 0) return { label: 'Out of Stock', cls: 'out-stock' };
    if (stock <= 15) return { label: 'Low Stock',    cls: 'low-stock' };
    return                 { label: 'In Stock',      cls: 'in-stock'  };
  }
};

// ─── VENDOR FUNCTIONS ─────────────────────────────────────────────────────────

const Vendors = {
  all() { return get(DB.vendors); },

  add(data) {
    const vendors = this.all();
    const vendor = { id: nextId('V'), totalPurchases: 0, ...data };
    vendors.unshift(vendor);
    set(DB.vendors, vendors);
    return vendor;
  },

  update(id, data) {
    const vendors = this.all().map(v => v.id === id ? { ...v, ...data } : v);
    set(DB.vendors, vendors);
  },

  delete(id) {
    set(DB.vendors, this.all().filter(v => v.id !== id));
  },

  get(id) { return this.all().find(v => v.id === id); },

  // Record a purchase from vendor: increases stock, logs transaction
  recordPurchase(vendorId, items, total) {
    const vendor = this.get(vendorId);
    if (!vendor) return;

    // Increase stock for each item
    items.forEach(item => {
      Products.adjustStock(item.productId, item.qty);
    });

    // Update vendor total
    this.update(vendorId, { totalPurchases: (vendor.totalPurchases || 0) + total });

    // Log transaction
    const ref = nextId('PO');
    Transactions.add({
      type: 'paid',
      entity: vendor.name,
      reference: ref,
      amount: total,
      note: `Stock purchase from ${vendor.name}`,
    });

    return ref;
  }
};

// ─── ORDER FUNCTIONS ──────────────────────────────────────────────────────────

const Orders = {
  all() { return get(DB.orders); },

  // Main function: creates order, deducts stock, creates invoice, logs transaction
  create(clientId, items, status = 'Pending') {
    const client = Clients.get(clientId);
    if (!client) return null;

    const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const orderId = nextId('#');
    const invoiceId = nextId('INV');

    // Build order
    const order = {
      id: orderId,
      clientId,
      clientName: client.name,
      items,
      total,
      status,
      date: today(),
      invoiceId,
    };

    // Deduct stock for each item
    items.forEach(item => Products.adjustStock(item.productId, -item.qty));

    // Create invoice
    const invoice = {
      id: invoiceId,
      orderId,
      clientId,
      clientName: client.name,
      items,
      total,
      status: status === 'Paid' ? 'Paid' : 'Unpaid',
      issueDate: today(),
      dueDate: dueDate(15),
    };
    const invoices = get(DB.invoices);
    invoices.unshift(invoice);
    set(DB.invoices, invoices);

    // Log transaction if paid
    if (status === 'Paid') {
      Transactions.add({
        type: 'received',
        entity: client.name,
        reference: invoiceId,
        amount: total,
        note: `Payment for order ${orderId}`,
      });
    }

    // Save order
    const orders = this.all();
    orders.unshift(order);
    set(DB.orders, orders);

    return order;
  },

  markPaid(orderId) {
    const orders = this.all();
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'Paid') return;

    order.status = 'Paid';
    set(DB.orders, orders);

    // Update invoice
    const invoices = get(DB.invoices);
    const inv = invoices.find(i => i.id === order.invoiceId);
    if (inv) { inv.status = 'Paid'; set(DB.invoices, invoices); }

    // Log transaction
    Transactions.add({
      type: 'received',
      entity: order.clientName,
      reference: order.invoiceId,
      amount: order.total,
      note: `Payment received for ${orderId}`,
    });
  },

  delete(orderId) {
    set(DB.orders, this.all().filter(o => o.id !== orderId));
  }
};

// ─── INVOICE FUNCTIONS ────────────────────────────────────────────────────────

const Invoices = {
  all() { return get(DB.invoices); },
  get(id) { return this.all().find(i => i.id === id); },

  markPaid(invoiceId) {
    const invoices = this.all();
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv || inv.status === 'Paid') return;
    inv.status = 'Paid';
    set(DB.invoices, invoices);

    // Also mark the linked order paid
    const orders = get(DB.orders);
    const order = orders.find(o => o.invoiceId === invoiceId);
    if (order && order.status !== 'Paid') {
      order.status = 'Paid';
      set(DB.orders, orders);
      Transactions.add({
        type: 'received',
        entity: inv.clientName,
        reference: invoiceId,
        amount: inv.total,
        note: `Invoice ${invoiceId} marked paid`,
      });
    }
  }
};

// ─── TRANSACTION FUNCTIONS ────────────────────────────────────────────────────

const Transactions = {
  all() { return get(DB.transactions); },

  add(data) {
    const txns = this.all();
    const txn = { id: nextId('TXN'), date: today(), ...data };
    txns.unshift(txn);
    set(DB.transactions, txns);
    return txn;
  },

  addExpense(entity, amount, note) {
    return this.add({ type: 'expense', entity, reference: nextId('EXP'), amount, note });
  },

  summary() {
    const txns = this.all();
    const received = txns.filter(t => t.type === 'received').reduce((s, t) => s + t.amount, 0);
    const paid     = txns.filter(t => t.type === 'paid').reduce((s, t) => s + t.amount, 0);
    const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { received, paid, expenses, balance: received - paid - expenses };
  }
};

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

const Dashboard = {
  stats() {
    const orders   = Orders.all();
    const clients  = Clients.all();
    const { received, balance } = Transactions.summary();
    const pending  = orders.filter(o => o.status === 'Pending').reduce((s, o) => s + o.total, 0);
    return {
      totalOrders:     orders.length,
      totalRevenue:    received,
      totalClients:    clients.length,
      pendingPayments: pending,
      balance,
    };
  }
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Run seed on load
seedIfEmpty();
from flask import Flask, render_template, request, redirect, url_for, session

import pandas as pd

app = Flask(__name__)

app.secret_key = 'your-secret-key'  # Required for sessions

# Function to read Excel and extract brand-sales structure mapping
def get_data_from_excel():
    data = {}
    file_path = r"data2_exl.xlsx"  # Update path

    try:
        gn_df = pd.read_excel(file_path, engine="openpyxl").fillna('')
    except FileNotFoundError:
        print("Error: Excel file not found!")
        return data
    except Exception as e:
        print(f"Unexpected error while reading Excel: {e}")
        return data

    for index, row in gn_df.iterrows():
        brand = row.get('Brand', '').strip()
        sales_structure = row.get('Normal Structure (MLP RRP)', '').strip()
        rrp_formula = row.get('RRP', '').strip()
        price_formula = row.get('Price', '').strip()
        data[brand] = [sales_structure, rrp_formula, price_formula]

    return data

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'username' not in session:
        return redirect(url_for('login'))

    data = get_data_from_excel()
    selected_brand = request.form.get('brand', '')

    if selected_brand in data:
        sales_structure = data[selected_brand][0]
        rrp_formula = data[selected_brand][1]
        price_formula = data[selected_brand][2]
    else:
        sales_structure = ""
        rrp_formula = ""
        price_formula = ""

    return render_template(
        'index2.html',
        brands=data.keys(),
        sales_structure=sales_structure,
        selected_brand=selected_brand,
        rrp_formula=rrp_formula,
        price_formula=price_formula
    )

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == 'admin' and password == '1234':
            session['username'] = username
            return redirect(url_for('index'))
        else:
            error = 'Invalid credentials'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

#test

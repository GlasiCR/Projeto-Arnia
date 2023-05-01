//_first screen: my patients
const div_patients = document.querySelector('.div_listPatients')
const bt_filter = document.querySelector('.bt_filter')
const bt_edit = document.querySelector('.bt_edit')
const bt_delete = document.querySelector('.bt_delete')
const bt_deleteConfirm = document.querySelector('.bt_deleteConfirm')
const input_filterPatient = document.querySelector('.input_filterPatient')
const crescente = document.getElementById('crescente')
const decrescente = document.getElementById('decrescente')
//_data patients
const cpf_customer = document.querySelector('.cpf_customer')
const name_customer = document.querySelector('.name_customer')
const born_customer = document.querySelector('.born_customer')
const email_customer = document.querySelector('.email_customer')
const sexo_customer = document.querySelector('.sexo_customer')
const nationality_customer = document.querySelector('.nationality_customer')
const naturalness_customer = document.querySelector('.naturalness_customer')
const profession_customer = document.querySelector('.profession_customer')
const schooling_customer = document.querySelector('.schooling_customer')
const maritalStt_customer = document.querySelector('.marital_stt_customer')
const motherName_customer = document.querySelector('.motherName_customer')
const fatherName_customer = document.querySelector('.fatherName_customer')
//_modal: delete
const div_confirmDelete = document.querySelector('.div_confirmDelete')
//_modal:edit
const bt_edit_patient = document.querySelector('.bt_edit_patient')
let title_modal = document.querySelector('#title_modal')
let elementInvisibility = document.getElementById('elementInvisibility')
let elementVisibility = document.getElementById('elementVisibility')
let editPatient_modal = new bootstrap.Modal('#editPatient_modal')
//_register new patient
const bt_new_patient = document.querySelector('.bt_new_patient')
const regPacient_sucess = new bootstrap.Modal('#regPacient_sucess')
const fieldset = document.querySelector('#fieldset')
let new_Paciente = document.getElementById('new_Paciente')
const modalCreatePacient = new bootstrap.Modal('#modalCreatePacient')

user_logado()

//_POST
async function create_user(patient){
  await fetch("https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient", {
      method: "POST",
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient)
  })
}
//Cria paciente. Acionado no botão ".bt_new_patient" (p/ usuário: Novo cadastro), modal "#modalCreatePacient"
new_Paciente.addEventListener('submit', function add_customer(e){
  e.preventDefault()
  patient = {
    cpf: document.querySelector('.cpf_customer').value,
    nome: document.querySelector('.name_customer').value,
    dt_nasc: document.querySelector('.born_customer').value,
    email: document.querySelector('.email_customer').value,
    sexo: document.querySelector('.sexo_customer').value,
    nacionalidade: document.querySelector('.nationality_customer').value,
    naturalidade: document.querySelector('.naturalness_customer').value,
    profissao: document.querySelector('.profession_customer').value,
    escolaridade: document.querySelector('.schooling_customer').value,
    est_civil: document.querySelector('.marital_stt_customer').value,
    nome_mae: document.querySelector('.motherName_customer').value,
    nome_pai: document.querySelector('.fatherName_customer').value,
  }
  create_user(patient)
  
  modalCreatePacient.hide()
  div_patients.innerHTML = ''
  new_Paciente.reset()
  get_patient()
  regPacient_sucess.show()
  setTimeout(function(){
    regPacient_sucess.hide()
  }, 3000)
})

//Utilizado para paginação
let page = 1
//_GET. Carrega a lista de pacientes na tela inicial
async function get_patient(){
  const res_fetch = await fetch(`https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient?_page=${page}&_limit=5`)
  const reg_patients = await res_fetch.json()
  print_pacientPage(reg_patients)
  return reg_patients
}
//Função que monta e imprimi dados na tela
function print_pacientPage(array){
  array.forEach(function print_patient(element){
    div_patients.innerHTML = div_patients.innerHTML + `<div class="d-flex altCur">
    <div onclick="seila(${element.id})" class="col-2 text-center align-middle border codigo_do_cliente">${element.id} </div>
    <div onclick="seila(${element.id})" class="col-4 text-center border nome_do_cliente">${element.nome} </div>
    <div onclick="seila(${element.id})" class="col-4 text-center border cpf_do_cliente">${element.cpf} </div>
    <div class="col-2 text-center border botoes"> 
    <a href="prontuario.html?patient=${element.id}&nome=${element.nome}&dtNasc=${element.dt_nasc}&prof=${element.profissao}&esc=${element.escolaridade}"><img src="imagens/btView.png"></a> 
    <button onclick="get_editPatient(${element.id})" class="bt_edit bt_action" data-bs-toggle="modal" data-bs-target="#editPatient_modal"><img src="imagens/btEdit.png"></button>
    <button onclick="remove_patient(${element.id}, '${element.nome}')" data-bs-toggle="modal" data-bs-target="#deletePatient_modal" class="bt_delete bt_action"><input type="hidden" id="${element.id}_delete"> <img src="imagens/btDelete.png"></button </div>
    </div>`
})
}
//Necessário chamar função, caso contrário não carrega os dados no navegador
get_patient()

//GET - Função que obtenho o tamanho da minha lista do JSON, uso essa informação para fazer a paginação
async function all_patient(){
  const res_fetch = await fetch(`https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient`)
  const reg_patients = await res_fetch.json()
  return reg_patients
}
const next_page = document.querySelector('.next_page')
next_page.addEventListener('click', async function avanca(){
  page = page + 1
  div_patients.innerHTML = ""
  get_patient()
})
const return_page = document.querySelector('.return_page')
return_page.addEventListener('click', async function volta(){
  if(page > 1){
    page = page - 1
  }
  div_patients.innerHTML = ""
  get_patient()
})

//GET - Funções que realizam a dinâmica de, ao clicar na linha do paciente, aparece o modal de edição, mas com os inputs dimados
const seila2 = (id)=>{
  if(fieldset.classList.contains('disabled')== false){
    fieldset.setAttribute('disabled', 'disabled');
    elementInvisibility.setAttribute('class', 'visually-hidden');
    elementVisibility.removeAttribute('class', 'visually-hidden');
    title_modal.innerHTML = 'Dados do paciente' 
  }
}
async function seila(id){
  await get_editPatient(id)
  seila2(id)
  editPatient_modal.show()
}

//PUT
async function put_patient(id, patient){
  await fetch(`https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient/${id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patient)
  })
}
//PUT - Função que atualiza informações editadas. Acionada no botão ".bt_edit_patient"(p/ usuário: Atualizar alterações) do modal "#editPatient_modal"
bt_edit_patient.addEventListener('click', async function update_pacient(e){
  e.preventDefault()
  //preciso capturar antes
  let id = document.getElementById('id').value
  patient = {
    cpf: document.querySelector('#cpf_edit').value,
    nome: document.querySelector('#nome_edit').value,
    dt_nasc: document.querySelector('#dtBorn_edit').value,
    email: document.querySelector('#email_edit').value,
    sexo: document.querySelector('#genero_edit').value,
    nacionalidade: document.querySelector('#nacionality_edit').value,
    naturalidade: document.querySelector('#naturalness_edit').value,
    profissao: document.querySelector('#profession_edit').value,
    escolaridade: document.querySelector('#schooling_edit').value,
    est_civil: document.querySelector('#marital_stt_edit').value,
    nome_mae: document.querySelector('#motherName_edit').value,
    nome_pai: document.querySelector('#fatherName_edit').value,
  }
  console.log("chamei a função edição")
  await put_patient(id, patient)
  div_patients.innerHTML = ''
  get_patient()
})
//GET/(para PUT)-Recebe informações do banco de dados para possível edição. Acionada quando clica no ícone ".bt_edit" na tela my_patients
async function get_editPatient(id, patient){
  const res_fetch = await fetch('https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient/' + id)
  const reg_patients = await res_fetch.json()
  title_modal.innerHTML = 'Editar dados do paciente'
  
  fieldset.removeAttribute('disabled', 'disabled')
  elementInvisibility.removeAttribute('class', 'visually-hidden')
  elementVisibility.setAttribute('class', 'visually-hidden')
  title_modal.innerHTML = 'Editar dados do paciente'

  document.getElementById('cpf_edit').value = reg_patients.cpf
  document.getElementById('nome_edit').value = reg_patients.nome
  document.getElementById('dtBorn_edit').value = reg_patients.dt_nasc
  document.getElementById('email_edit').value = reg_patients.email
  document.getElementById('genero_edit').value = reg_patients.sexo
  document.getElementById('nacionality_edit').value = reg_patients.nacionalidade
  document.getElementById('naturalness_edit').value = reg_patients.naturalidade
  document.getElementById('profession_edit').value = reg_patients.profissao
  document.getElementById('schooling_edit').value = reg_patients.escolaridade
  document.getElementById('marital_stt_edit').value = reg_patients.est_civil
  document.getElementById('motherName_edit').value = reg_patients.nome_mae
  document.getElementById('fatherName_edit').value = reg_patients.nome_pai
  document.getElementById('id').value = reg_patients.id
  return reg_patients
}

//DELETE. Modal, #deletePatient_modal, pede para usuário confirmar se realmente deseja excluir ficha do paciente. Acionado pelo botão/ícone bt_delete na tela my_patients
function remove_patient(id, nome, pacient){
  div_confirmDelete.innerHTML = `
  <input type="hidden" id=${id}>
  <p class="text-center mb-2 mt-3">Tem certeza que deseja excluir a ficha do paciente <span class="txt_green"><b>${nome}</b></span>.</p>
  <p class="text-center mb-4">Uma vez cancelado não será possível recuperar.</p>
  <div class="modal-footer">
    <button type="button" class="btn px-5" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" onclick="detele_pacient(${id})" class="btn px-5 bt_green bt_deleteConfirm" data-bs-dismiss="modal">Confirmar</button>
  </div>`
}
//DELETE
async function detele_pacient(id, pacient){
  await fetch(`https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient/${id}`, {
    method: "DELETE"
  })
  div_patients.innerHTML = ''
  get_patient()
}

//GET - Filtro por nome. Após pesquisa, os dados são recarregados conforme solicitação de pesquisa. Acionada no botão "bt_filter" (p/ usuário: Filtrar)
async function get_filterPacient(nome){
  const res_fetch = await fetch('https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient?q='+ nome)
  const reg_patients = await res_fetch.json()
  div_patients.innerHTML = ''
  console.log(reg_patients)
  print_pacientPage(reg_patients)
}
//FILTRAR
bt_filter.addEventListener('click', async function filter_pacient(e){
  e.preventDefault()
  let input_filterPatient = document.querySelector('.input_filterPatient').value
  let list_patient

  if(input_filterPatient === ''){
    div_patients.innerHTML = ''
    get_patient()
  }else{
    list_patient = await get_filterPacient(input_filterPatient)
  }
  console.log(input_filterPatient)
})
//FILTRAR. Reconhece tecla "Enter" como um click e tem o mesmo comportamento
input_filterPatient.addEventListener('keypress', async function praque(tecla){
    if (tecla.key === 'Enter') {
    tecla.preventDefault()
    let word_search = input_filterPatient.value 
    console.log(word_search)
    await get_filterPacient(word_search)
  }
})

//GET - Ordenação
//Atributo global, utilizado para ordenação
let typeOrder

async function get_orderPacients(orderBy, typeOrder){
  const res_fetch = await fetch(`https://db-projeto-arnia-gerenciador-de-pacientes.onrender.com/patient?_sort=${orderBy}&_order=${typeOrder}`)
  const listPatient = await res_fetch.json()
  console.log(listPatient)
  print_pacientPage(listPatient)
}
//ORDENAÇÃO - Crescente
crescente.addEventListener('click', async()=>{
  typeOrder = "asc"
  div_patients.innerHTML = ''
  await get_orderPacients("nome", typeOrder)
})
//ORDENAÇÃO - Decrescente
decrescente.addEventListener('click', async()=>{
  typeOrder = "desc"
  div_patients.innerHTML = ''
  await get_orderPacients("nome", typeOrder)
})

//PRONTUÁRIO

function prontuario(){
  user_logado()
  
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString);
  const nome_patient = urlParams.get('nome')
  const dtNasc_patient = urlParams.get('dtNasc')
  const prof_patient = urlParams.get('prof')
  const esc_patient = urlParams.get('esc')

  let name_pront = document.getElementById('name_pront')
  let born_pront = document.getElementById('born_pront')
  let prof_pront = document.getElementById('prof_pront')
  let sc_pront = document.getElementById('sc_pront') 

  name_pront.innerHTML = nome_patient
  born_pront.innerHTML = dtNasc_patient
  prof_pront.innerHTML = prof_patient
  sc_pront.innerHTML = esc_patient
}

//GET - Identificação usuário logado (tela meus pacientes)
//Atributos que vou precisar para identificação do usuário
function user_logado(){
  const email = localStorage.getItem('email');
  const nameAll_user = localStorage.getItem('nome');
  const nome = nameAll_user.split(' ')[0]
  
  let email_userLogado = document.querySelector('.email_userLogado')
  let name_userLogado = document.querySelector('.name_userLogado')
  
  email_userLogado.innerHTML = email;
  name_userLogado.innerHTML = nome;


  // const queryString = window.location.search
  // const urlParams = new URLSearchParams(queryString);
  // const nameAll_user = urlParams.get('nome')
  // const name_user = nameAll_user.split(' ')[0]
  // const email_user = urlParams.get('email')

  // email_userLogado.innerHTML = email_user
  // name_userLogado.innerHTML = name_user
}


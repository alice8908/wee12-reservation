// Making a reservation will need the name of customer
// Need Name for main info, adding details such as
// Phone number, how many of the guests, and ETA 
class Reservation {
    constructor(name, ) {
      this.name = name;
      this.details = [];
    }
  
    addDetail(phone, party, time) {
      this.details.push(new Detail(phone, party, time));
    }
  }
  class Detail {
    constructor(phone, party, time) {
      this.phone = phone;
      this.party = party;
      this.time = time;
    }
  }


  // MOCK API
  // CURD Operations
  class ReservationService {
    static url = 'https://63502b28df22c2af7b657cd0.mockapi.io/current/reservations';

    // method for interacting with API
    static getAllReservations() {
      return $.get(this.url);
    }

    // method for getting reservatin data
    static getReservation(_id) {
      return $.get(this.url + `/${_id}`);
    }

    // method for creating new reservation
    static createReservation(reservation) {
      return $.post(this.url, reservation);
    }
    
    // method for updating reservation info.
    static updateReservation(reservation) {
      return $.ajax({
        url: this.url + `/${reservation._id}`,
        dataType: 'json',
        data: JSON.stringify(reservation),
        contentType: 'application/json',
        type: 'PUT'
      });
    }
  
    // method for deleting reservation
    static deleteReservation(_id) {
      return $.ajax({
        url: this.url + `/${_id}`,
        type: 'DELETE'
      });
    }
  }
  
  // Managing DOM.
  class DOMManager {
    static reservations;
  
    // Fetch the reservation info from API
    static getAllReservations() {
      ReservationService.getAllReservations().then(reservations => this.render(reservations));
    }
  
    // Creates a new reservation and render
    static createReservation(name) {
      ReservationService.createReservation(new Reservation(name))
        .then(() => {
          return ReservationService.getAllReservations();
        })
        .then((reservations) => this.render(reservations));
    }
    // Deletes one entire reservation info
    static deleteReservation(_id) {
      ReservationService.deleteReservation(_id)
        .then(() => {
          return ReservationService.getAllReservations();
        })
        .then((reservations) => this.render(reservations));
    }
  
    // Add a detail info to the reservation data
    static addDetail(id) {
      for (let reservation of this.reservations) {
        if (reservation._id == id) {
          reservation.details.push(new Detail($(`#${reservation._id}-detail-phone`).val(), $(`#${reservation._id}-detail-party`).val(), $(`#${reservation._id}-detail-time`).val()));
          ReservationService.updateReservation(reservation)
            .then(() => {
              return ReservationService.getAllReservations();
            })
            .then((reservations) => {
              this.render(reservations)
            });
        }
      }
    }
  
    // Delete detail data from the reservation. Remain name.
    static deleteDetail(reservationId, detailId) {
      for (let reservation of this.reservations) {
        if (reservation._id == reservationId) {
          for (let detail of reservation.details) {
            if (detail._id == detailId) {
              reservation.details.splice(reservation.details.indexOf(detail), 1);
              ReservationService.updateReservation(reservation)
                .then(() => {
                  return ReservationService.getAllReservations();
                })
                .then((reservations) => this.render(reservations));
            }
          }
        }
      }
    }
  
    // Render reservation and creates the information.
    static render(reservations) {
      this.reservations = reservations;
      $('#reserve-table').empty();
      for (let reservation of reservations) {
        $('#reserve-table').prepend(
          `<div id="${reservation._id}" class="card">
    <div class="card-header">
      <h2>${reservation.name}</h2>
      <button class="btn btn-warning" onclick="DOMManager.deleteReservation('${reservation._id}')">Delete</button>
    </div>
    <div class="card-body">
      <div class="card">
        <div class="row">
          <div class="col-sm">
            <input type="text" id="${reservation._id}-detail-phone" class="form-control" placeholder="Phone Number">
          </div>
          <div class="col-sm">
            <input type="text" id="${reservation._id}-detail-party" class="form-control" placeholder="How many of you?">
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <input type="text" id="${reservation._id}-detail-time" class="form-control"
              placeholder="What time would you like to come? ( ex) 6:30 P.M)">
          </div>
          <button id="${reservation._id}-new-detail" onclick="DOMManager.addDetail('${reservation._id}')"
            class="btn btn-success form-control">Add</button>
        </div>
      </div>
    </div>
  </div><br>`
        );
        // Display the detail information for user.
        // Blank holds Phone Number, number of guests, time.
        for (let details of reservation.details) {
          $(`#${reservation._id}`).find('.card-body').append(
            `<p>
                        <span id="${details.id}-phone"><strong>Phone Number: </strong>${details.phone}</span>
                        <span id="${details.id}-party"><strong>How many guests: </strong> ${details.party}</span>
                        <span id="${details.id}-time"><strong>Reservation Time: </strong> ${details.time}</span>
                        <button class="btn btn-warning" onclick="DOMManager.deleteDetail('${reservation._id}',
                        '${details.id}')">Delete</button>
                    </p>`
          )
        }
      }
    }
  };
  
  // Creating reservation button with event listener.
  $('#create-new-reservation').on('click', () => {
    DOMManager.createReservation($('#new-reservation-name').val());
    $('#new-reservation-name').val('');
  });
  
  DOMManager.getAllReservations();